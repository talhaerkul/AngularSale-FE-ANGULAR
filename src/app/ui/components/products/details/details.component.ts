import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseUrl } from 'src/app/contracts/baseUrl/base-url';
import { List_Product } from 'src/app/contracts/products/list_product';
import { FileService } from 'src/app/services/common/models/file.service';
import { ProductService } from 'src/app/services/common/models/product.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { _isAuthenticated } from 'src/app/services/common/auth.service';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Create_Basket_Item } from 'src/app/contracts/basket/create_basket_item';
import { BasketService } from 'src/app/services/common/models/basket.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent extends BaseComponent implements OnInit {

  constructor(private route: ActivatedRoute, private productService: ProductService,
    private fileService: FileService, spinner: NgxSpinnerService,
    private basketService: BasketService, private toastr: CustomToastrService, private router: Router) { super(spinner); }
  baseUrl: BaseUrl;
  id: string;
  product: List_Product;
  async ngOnInit() {
    this.baseUrl = await this.fileService.getBaseStorageUrl();
    this.route.paramMap.subscribe(async (data) => {
      // data is type of paramMap [https://angular.io/api/router/ParamMap]
      console.log(data.getAll);
      this.id = data.get('id');
      this.product = await this.productService.getProductById(this.id);
      this.product.productImageFiles = await this.productService.readImages(this.id);
      this.link1 = this.product.productImageFiles[0]?.path ?? "../../../../../assets/img/no-image.png";
      this.link2 = this.product.productImageFiles[1]?.path ?? this.product.productImageFiles[0].path;
      this.link3 = this.product.productImageFiles[2]?.path ?? this.product.productImageFiles[0].path;
      this.link4 = this.product.productImageFiles[3]?.path ?? this.product.productImageFiles[1].path;
      this.link5 = (this.product.productImageFiles[4]?.path ?? this.product.productImageFiles[2].path) ?? this.product.productImageFiles[1].path;
    });

  }

  async addToBasket() {
    if (_isAuthenticated) {
      this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
      let _basketItem: Create_Basket_Item = new Create_Basket_Item();
      _basketItem.productId = this.id;
      _basketItem.quantity = 1;
      debugger;
      await this.basketService.create(_basketItem);
      this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
      this.toastr.message("Product added to cart", "Cart", { messageType: ToastrMessageType.Success, position: ToastrPosition.TopRight });
    }
    else {
      let url = this.router.url;
      window.location.href = "/login?returnUrl="+url;
    }
  }


  //links
  link1 = "";
  link2 = "";
  link3 = "";
  link4 = "";
  link5 = "";


  // slider
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }

}


