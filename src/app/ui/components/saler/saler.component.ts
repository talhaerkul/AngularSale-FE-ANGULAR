import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { BaseUrl } from 'src/app/contracts/baseUrl/base-url';
import { Create_Basket_Item } from 'src/app/contracts/basket/create_basket_item';
import { List_Product } from 'src/app/contracts/products/list_product';
import { _isAuthenticated } from 'src/app/services/common/auth.service';
import { BasketService } from 'src/app/services/common/models/basket.service';
import { FileService } from 'src/app/services/common/models/file.service';
import { ProductService } from 'src/app/services/common/models/product.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-saler',
  templateUrl: './saler.component.html',
  styleUrls: ['./saler.component.scss']
})
export class SalerComponent extends BaseComponent implements OnInit{
  constructor(spinner: NgxSpinnerService, private basketService: BasketService, private toastr: CustomToastrService,
    private fileService: FileService,private activatedRoute: ActivatedRoute, private productService: ProductService) {
    super(spinner);

  }
  products: List_Product[];
  baseUrl: BaseUrl;
  salerUsername : string = "";
  currentPage: number;
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 18;
  pageList: number[] = [];
  linkSaler = "/saler";

  async ngOnInit() {
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);

    this.baseUrl = await this.fileService.getBaseStorageUrl();
    this.activatedRoute.params.subscribe(async params => {
      this.salerUsername = params["name"];
      this.linkSaler = "/saler/"+params["name"];

      this.currentPage = parseInt(params["page"] ?? 1);
      const data: { totalCount: number, products: List_Product[] } = await this.productService.getProductsBySaler(this.currentPage - 1, this.pageSize,
        this.salerUsername, () => { },
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
          categories : p.categories
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
  async addToBasket(basketItem: List_Product) {
    if (_isAuthenticated) {
      this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
      let _basketItem: Create_Basket_Item = new Create_Basket_Item();
      _basketItem.productId = basketItem.id;
      _basketItem.quantity = 1;
      await this.basketService.create(_basketItem);
      this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
      this.toastr.message("Product added to cart", "Cart", { messageType: ToastrMessageType.Success, position: ToastrPosition.TopRight });
    }
    else {
      this.toastr.message("Please Login!", "", { messageType: ToastrMessageType.Info, position: ToastrPosition.TopRight });
    }
  }
}
