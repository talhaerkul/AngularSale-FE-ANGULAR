import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UiLayoutComponent } from './ui-layout/ui-layout.component';



@NgModule({
  declarations: [
    NavbarComponent,
    UiLayoutComponent,

  ],
  imports: [
    CommonModule,
    //
    ComponentsModule,
    RouterModule,
    NgxSpinnerModule
    //
  ],
  //
  exports: [
    NavbarComponent
  ]
  //
})
export class UiModule { }
