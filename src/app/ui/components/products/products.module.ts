import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailsModule } from './details/details.module';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [
    ProductsComponent,
    ListComponent,

  ],
  imports: [
    CommonModule,
    DetailsModule,
    RouterModule.forChild([
      {path: "", component: ProductsComponent},
      {path: "brands/:brand", component: ProductsComponent},
      {path: "brands/:brand/:page", component: ProductsComponent},
      {path: "categories/:category", component: ProductsComponent},
      {path: "categories/:category/:page", component: ProductsComponent}
    ]),
    CarouselModule,
  ]
})
export class ProductsModule { }
