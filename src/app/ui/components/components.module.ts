import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsModule } from './products/products.module';
import { BasketsModule } from './baskets/baskets.module';
import { HomeModule } from './home/home.module';
import { RegisterModule } from './register/register.module';
import { UpdatePasswordModule } from './update-password/update-password.module';
import { SalerModule } from './saler/saler.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    //
    ProductsModule,
    BasketsModule,
    HomeModule,
    RegisterModule,
    SalerModule,
    //LoginModule
    UpdatePasswordModule
    //

  ]
})
export class ComponentsModule { }
