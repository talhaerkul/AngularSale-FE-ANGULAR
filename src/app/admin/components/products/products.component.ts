import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_Product } from 'src/app/contracts/products/create_product';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent{


  // ürün create komponentinde eklendiğinde emit edildiğinde, bağlı olduğu moduleün komponentinde child oluşturup
  // ürün oluşunca get products'ı tetikledik
  @ViewChild(ListComponent) listComponent : ListComponent
  createdProduct(productInEvent: Create_Product){
    this.listComponent.getProducts();
  }

}
