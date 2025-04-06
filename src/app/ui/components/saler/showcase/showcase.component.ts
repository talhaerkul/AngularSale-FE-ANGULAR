import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { BaseUrl } from 'src/app/contracts/baseUrl/base-url';
import { List_Product } from 'src/app/contracts/products/list_product';
import { AddProductDialogComponent } from 'src/app/dialogs/add-product-dialog/add-product-dialog.component';
import { ProductUpdateDialogComponent } from 'src/app/dialogs/product-update-dialog/product-update-dialog.component';
import { QrcodeReadDialogComponent } from 'src/app/dialogs/qrcode-read-dialog/qrcode-read-dialog.component';
import { SelectProductImageDialogComponent } from 'src/app/dialogs/select-product-image-dialog/select-product-image-dialog.component';
import { DialogService } from 'src/app/services/common/dialog.service';
import { FileService } from 'src/app/services/common/models/file.service';
import { ProductService } from 'src/app/services/common/models/product.service';
import { CustomToastrService } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})
export class ShowcaseComponent extends BaseComponent implements OnInit {
  constructor(spinner: NgxSpinnerService, private toastr: CustomToastrService,
    private fileService: FileService, private activatedRoute: ActivatedRoute,
    private productService: ProductService, private dialogService: DialogService) {
    super(spinner);

  }
  products: List_Product[];
  baseUrl: BaseUrl;
  currentPage: number;
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 18;
  pageList: number[] = [];
  linkSaler = "/saler/showcase";
  salerName: string = "";

  async ngOnInit() {
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);

    this.baseUrl = await this.fileService.getBaseStorageUrl();
    this.activatedRoute.params.subscribe(async params => {
      this.salerName = params["id"];
      this.linkSaler = "/saler/showcase/" + params["id"];

      this.currentPage = parseInt(params["page"] ?? 1);
      const data: { totalCount: number, products: List_Product[] } = await this.productService.getShowcaseBySaler(this.currentPage - 1, this.pageSize,
        this.salerName, () => { },
        () => { });
      this.products = data.products;

      this.products = this.products.map<List_Product>(p => {
        const listProduct: List_Product = {
          name: p.name,
          brand: p.brand,
          description: p.description,
          id: p.id,
          salerUsername: p.salerUsername,
          price: p.price,
          stock: p.stock,
          updatedDate: p.updatedDate,
          createdDate: p.createdDate,
          imagePath: p.productImageFiles.length ? p.productImageFiles.find(p => p.showcase).path : "",
          productImageFiles: p.productImageFiles,
          categories: p.categories
        }
        return listProduct;
      });

      this.totalProductCount = data.totalCount;
      this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

      this.pageList = [];

      if (this.currentPage - 3 <= 0) {
        for (let i = 1; i <= this.totalPageCount; i++) {
          this.pageList.push(i);
        }
      }
      else if (this.currentPage + 3 >= this.totalPageCount) {
        for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++) {
          this.pageList.push(i);
        }
      }
      else {
        for (let i = this.currentPage - 3; i <= this.currentPage; i++) {
          this.pageList.push(i);
        }
      }
      this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    });
  }
  updateProduct(id: string){
    this.dialogService.openDialog({
      componentType: ProductUpdateDialogComponent,
      data: id,
      options: {
        width: "800px"
      }
    });
  }
  addProductImages(id:string){
    this.dialogService.openDialog({
      componentType: SelectProductImageDialogComponent,
      data: id,
      options: {
        width: "1400px"
      }
    });
  }
  getProductQrCode(id: string){
    this.dialogService.openDialog({
      componentType: QrcodeReadDialogComponent,
      data: id
    });
  }
  addProduct(){
    this.dialogService.openDialog({
      componentType: AddProductDialogComponent,
      options: {
        width: "800px"
      }
    });
  }
}
