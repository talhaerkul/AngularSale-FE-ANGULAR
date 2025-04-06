import { Component, OnInit, ViewChild } from '@angular/core';
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

declare var $: any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(private productService: ProductService, spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute, private fileService: FileService,
    private basketService: BasketService, private toastr: CustomToastrService) { super(spinner); }

  currentPage: number;
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 20;
  pageList: number[] = [];

  data: { totalCount: number, products: List_Product[] };
  products: List_Product[];
  baseUrl: BaseUrl;
  linkUrl = "/products";
  async ngOnInit() {
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);

    this.baseUrl = await this.fileService.getBaseStorageUrl();
    this.activatedRoute.params.subscribe(async params => {

      this.currentPage = parseInt(params["page"] ?? 1);

      if (params["brand"]) {
        var brand: string = params["brand"];
        this.linkUrl = "/products/"+ brand;
        this.data = await this.productService.getProductsByBrand(this.currentPage - 1, this.pageSize, brand);
      }
      else if (params["category"]) {
        var category: string = params["category"];
        this.linkUrl = "/products/categories/"+ category;
        this.data = await this.productService.getProductsByCategory(this.currentPage - 1, this.pageSize, category);
      }
      else {
        this.data = await this.productService.getProducts(this.currentPage - 1, this.pageSize,
          "GetProducts", () => { },
          () => { });
      }

      this.products = this.data.products;
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
        if (listProduct.name.length >= 40) {
          listProduct.name = listProduct.name.substring(0,36)+"...";
        }
        return listProduct;
      });

      this.totalProductCount = this.data.totalCount;
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
      console.log(this.products);
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
      window.location.href = "/products/details/"+basketItem.id
    }
  }
}

$('#content').infiniteScroll({
  // options
  path: '.pagination__next',
  append: '.post',
  history: false,
});
