import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './details.component';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from '../products.component';
import { CarouselModule } from 'ngx-owl-carousel-o';



@NgModule({
  declarations: [
    DetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: "details/:id", component: DetailsComponent}
    ]),
    CarouselModule,
  ]
})
export class DetailsModule { }
