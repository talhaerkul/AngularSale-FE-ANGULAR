import { Component, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_Product } from 'src/app/contracts/products/create_product';
import { QrcodeDialogComponent } from 'src/app/dialogs/qrcode-dialog/qrcode-dialog.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends BaseComponent {

  constructor(spinner: NgxSpinnerService, private productService: ProductService, private alertify: AlertifyService,
    private dialogService: DialogService) {
    super(spinner);
  }

  // ürün eklediğimizde tabloyu yenilemek için diğer komponentle haberleşicez
  @Output() createdProduct : EventEmitter<Create_Product> = new EventEmitter();

  create(name: HTMLInputElement, brand: HTMLInputElement,description: HTMLInputElement, price: HTMLInputElement, stock: HTMLInputElement) {
    // nesneyi üretiyorum
    const create_product: Create_Product = new Create_Product();
    create_product.name = name.value;
    create_product.brand = brand.value;
    create_product.description = description.value;
    create_product.price = price.valueAsNumber;
    create_product.stock = stock.valueAsNumber;
    //yükleniyor simgesi ve nesneyi servisteki create metoduna yolluyorum
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    this.productService.createProduct(create_product,
      // success kısmı
      () => {
        this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
        this.alertify.message("Product Created", { messageType: MessageType.Success, delay: 1 });
        //haberleşme için oluşturduğumuz ürünü emit ediyoruz
        this.createdProduct.emit(create_product);
      },
      // error kısmı
      errorMessage => {
        this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
        this.alertify.message(errorMessage, { messageType: MessageType.Error, position: Position.TopCenter, delay: 13 })
      }
    );
  }
  createCategory(name: HTMLInputElement) {
    // nesneyi üretiyorum
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    this.productService.createcategory(name.value,
      // success kısmı
      () => {
        this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
        this.alertify.message("Caregory Created", { messageType: MessageType.Success, delay: 1 });
        //haberleşme için oluşturduğumuz ürünü emit ediyoruz
      }
    );
  }
  updateProductQrCode(){
    this.dialogService.openDialog({
      componentType: QrcodeDialogComponent
    });
  }

}
