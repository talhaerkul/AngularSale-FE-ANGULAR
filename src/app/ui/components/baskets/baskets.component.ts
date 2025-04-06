import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { BaseUrl } from 'src/app/contracts/baseUrl/base-url';
import { List_Basket_Item } from 'src/app/contracts/basket/list_basket_item';
import { Update_Basket_Item } from 'src/app/contracts/basket/update_basket_item';
import { List_Product_Image } from 'src/app/contracts/products/list_product_image';
import { DynamicLoadComponentDirective } from 'src/app/directives/common/dynamic-load-component.directive';
import { ComponentType, DynamicLoadComponentService } from 'src/app/services/common/dynamic-load-component.service';
import { BasketService } from 'src/app/services/common/models/basket.service';
import { FileService } from 'src/app/services/common/models/file.service';
import { ProductService } from 'src/app/services/common/models/product.service';
import { _isAuthenticated } from 'src/app/services/common/auth.service';
import { OrderService } from 'src/app/services/common/models/order.service';
import { Create_Order } from 'src/app/contracts/order/create_order';

declare var $: any;

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrls: ['./baskets.component.scss']
})
export class BasketsComponent extends BaseComponent implements OnInit {

  @ViewChild(DynamicLoadComponentDirective, { static: true })
  dynamicLoadComponentDirective: DynamicLoadComponentDirective;

  constructor(spinner: NgxSpinnerService, private basketService: BasketService,
    private fileService: FileService, private productService: ProductService,
    private dynamicLoadComponentService: DynamicLoadComponentService,
    private orderService: OrderService) {
    super(spinner);
  }
  isAuth = _isAuthenticated;

  baseUrl: BaseUrl;
  basketItems: List_Basket_Item[];
  images: List_Product_Image[];
  totalPrice: number;
  totalDiscount: number;
  orderTotal: number;
  cargo: number;
  async ngOnInit() {
    this.baseUrl = await this.fileService.getBaseStorageUrl();
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    this.basketItems = await this.basketService.get();
    this.total();
    debugger;
    this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
  }

  total(){
    this.totalPrice = 0;
    this.totalDiscount = 0;
    this.orderTotal = 0;
    this.cargo = 0;
    for (let item of this.basketItems) {
      this.totalPrice += item.price * item.quantity;
      this.orderTotal = this.totalPrice + this.cargo;
    }
  }

  async changeQuantity(object: any) {
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    const basketItemId: string = object.target.attributes["id"].value;
    const quantity: number = object.target.value;
    const basketItem: Update_Basket_Item = new Update_Basket_Item();
    basketItem.basketItemId = basketItemId;
    basketItem.quantity = quantity;
    await this.basketService.updateQuantity(basketItem);
    this.total();
    //$('tableTotal').DataTable().ajax.reload();
    window.location.href = "/basket"
    this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
  }

  async removeBasketItem(basketItemId: string) {
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    await this.basketService.remove(basketItemId);
    $("." + basketItemId).fadeOut(500, () => {this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating)});
  }

  loadComponent() {
    this.dynamicLoadComponentService.loadComponent(ComponentType.BasketsComponent, this.dynamicLoadComponentDirective.viewContainerRef);
  }

  async Payment(){
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    const order: Create_Order = new Create_Order();
    order.address = "adress";
    order.description = "description"
    await this.orderService.create(order,()=> {
      this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
      window.location.href = "/orders"
    });
  }

}
