import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseComponent } from './showcase.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ShowcaseComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: "showcase", component: ShowcaseComponent},
      {path: "showcase/:id", component: ShowcaseComponent},
      {path: "showcase/:id/:page", component: ShowcaseComponent}
    ]),
  ]
})
export class ShowcaseModule { }
