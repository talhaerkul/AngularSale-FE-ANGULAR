import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Product } from 'src/app/contracts/products/list_product';
import { ProductUpdateDialogComponent } from 'src/app/dialogs/product-update-dialog/product-update-dialog.component';
import { QrcodeReadDialogComponent } from 'src/app/dialogs/qrcode-read-dialog/qrcode-read-dialog.component';
import { SelectProductImageDialogComponent } from 'src/app/dialogs/select-product-image-dialog/select-product-image-dialog.component';
import { AlertifyService, MessageType } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { ProductService } from 'src/app/services/common/models/product.service';

declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent extends BaseComponent implements OnInit {
  constructor(spinner: NgxSpinnerService, private productService: ProductService,
    private alertify: AlertifyService, private dialogService: DialogService) {

    super(spinner);
  }

  displayedColumns: string[] = ["name","brand", "stock", "price", "createdDate", "updatedDate", "qrCode", "image" , "edit", "delete"];
  dataSource: MatTableDataSource<List_Product> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  async ngOnInit() {
    this.getProducts();
  }

  async getProducts() {
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);

    const allProducts: { totalCount: number, products: List_Product[] } = await this.productService.getProducts(
      this.paginator ? this.paginator.pageIndex : 0,
      this.paginator ? this.paginator.pageSize : 13,
      "GetProductList",
      () => {
        this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating)
      },
      () => {
        this.alertify.message("Error occured while getting products!", { messageType: MessageType.Error });
        this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
      });

    this.dataSource = new MatTableDataSource<List_Product>(allProducts.products);
    this.paginator.length = allProducts.totalCount;
  }
  addProductImages(id: string){
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

  updateProduct(id: string){
    this.dialogService.openDialog({
      componentType: ProductUpdateDialogComponent,
      data: id,
      options: {
        width: "800px"
      }
    });
    this.pageChanged();
  }
  async pageChanged() {
    await this.getProducts();
  }




}
