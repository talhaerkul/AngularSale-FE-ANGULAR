import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { ProductService } from 'src/app/services/common/models/product.service';
import { BaseDialog } from '../base/base-dialog';
import { List_Product } from 'src/app/contracts/products/list_product';
import { Category_List } from 'src/app/contracts/products/categories/category_list';
import { SpinnerType } from 'src/app/base/base.component';
import { Router } from '@angular/router';
import { DeleteDialogComponent, DeleteState } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-product-update-dialog',
  templateUrl: './product-update-dialog.component.html',
  styleUrls: ['./product-update-dialog.component.scss']
})
export class ProductUpdateDialogComponent extends BaseDialog<ProductUpdateDialogComponent> implements OnInit {
  constructor(
    dialogRef: MatDialogRef<ProductUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateState | string,
    private productService: ProductService, private dialogService: DialogService, private spinner: NgxSpinnerService,
    private alertify: AlertifyService, private router: Router
  ) {
    super(dialogRef);
  }
  product: List_Product;
  categories: Category_List[] = [];
  productCategories: Category_List[] = [];
  selectedCategories: string[] = [];
  productId: string;

  async ngOnInit() {
    this.productId = this.data as string;
    this.product = await this.productService.getProductById(this.data as string);
    this.categories = (await this.productService.getCategories()).categories;
    this.productCategories = (await this.productService.getCategoriesByProductId(this.data as string)).categories;
    for (let index = 0; index < this.productCategories.length; index++) {
      const element = this.productCategories[index];
      this.selectedCategories.push(element.name);
      for (let index = 0; index < this.categories.length; index++) {
        const _element = this.categories[index];
        if (element.name == _element.name) {
          this.categories.splice(index, 1);
        }
      }
    }
  }

  onChange(category: string): void {
    if (this.selectedCategories.includes(category)) {
      var index = this.selectedCategories.indexOf(category);
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  async update(txtName: HTMLInputElement, txtBrand: HTMLInputElement,
    txtDescription: HTMLInputElement, txtPrice: HTMLInputElement, txtStock: HTMLInputElement) {
    let product: List_Product = new List_Product;
    product.id = this.data as string;
    product.name = txtName.value;
    product.brand = txtBrand.value;
    product.description = txtDescription.value;
    product.price = parseInt(txtPrice.value);
    product.stock = parseInt(txtStock.value);
    this.categories.splice(0);
    for (let index = 0; index < this.selectedCategories.length; index++) {
      const e = this.selectedCategories[index];
      let c: Category_List = new Category_List;
      c.name = e;
      this.categories.push(c);
    }
    product.categories = this.categories;
    this.updateProduct(product);
    this.addProductToCategories(product.id, this.categories);
  }

  async updateProduct(product: List_Product) {
    this.spinner.show(SpinnerType.BallSpinClockwiseFadeRotating);
    await this.productService.updateProduct(product, () => {
      this.spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating);
      window.location.href = this.router.url;
    });
  }
  async addProductToCategories(id: string, categories: Category_List[]) {
    this.spinner.show(SpinnerType.BallSpinClockwiseFadeRotating);
    await this.productService.addProductToCategories(id, this.categories, () => {
      this.spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating);
    });
  }

  async deleteProduct() {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: () => {
        this.productService.delete(this.productId);
        window.location.href = this.router.url;
      }
    });
  }

}

export enum UpdateState {
  Update,
  Cancel
}
