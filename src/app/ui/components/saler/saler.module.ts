import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalerComponent } from './saler.component';
import { RouterModule } from '@angular/router';
import { ShowcaseModule } from './showcase/showcase.module';



@NgModule({
  declarations: [
    SalerComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: "", component: SalerComponent},
      {path: ":name", component: SalerComponent},
      {path: ":name/:page", component: SalerComponent}

    ]),
    ShowcaseModule
  ]
})
export class SalerModule { }
