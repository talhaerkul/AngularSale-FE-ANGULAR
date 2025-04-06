import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { ProductService } from 'src/app/services/common/models/product.service';
import { BaseDialog } from '../base/base-dialog';
import { List_Product } from 'src/app/contracts/products/list_product';
import { SpinnerType } from 'src/app/base/base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss']
})
export class AddProductDialogComponent  extends BaseDialog<AddProductDialogComponent>{
  constructor(
    dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService, private dialogService: DialogService, private spinner: NgxSpinnerService,
    private alertify: AlertifyService, private router: Router
  ) {
    super(dialogRef);
  }
  product: List_Product;

  async create(txtName: HTMLInputElement, txtBrand: HTMLInputElement,
    txtDescription: HTMLInputElement, txtPrice: HTMLInputElement, txtStock: HTMLInputElement) {
    let product: List_Product = new List_Product;
    product.id = this.data as string;
    product.name = txtName.value;
    product.brand = txtBrand.value;
    product.description = txtDescription.value;
    product.price = parseInt(txtPrice.value);
    product.stock = parseInt(txtStock.value);
    this.createProduct(product);
  }

  async createProduct(product: List_Product) {
    this.spinner.show(SpinnerType.BallSpinClockwiseFadeRotating);
    await this.productService.createProduct(product, () => {
      this.spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating);
    });
  }
}

export enum CreateState {
  Update,
  Cancel
}
