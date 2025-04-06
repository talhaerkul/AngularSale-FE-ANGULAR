import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { ProductService } from 'src/app/services/common/models/product.service';

declare var $: any;

@Component({
  selector: 'app-qrcode-dialog',
  templateUrl: './qrcode-dialog.component.html',
  styleUrls: ['./qrcode-dialog.component.scss']
})
export class QrcodeDialogComponent extends BaseDialog<QrcodeDialogComponent> implements OnInit, OnDestroy {

  constructor(
    dialogRef: MatDialogRef<QrcodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private spinner: NgxSpinnerService, private alertify: AlertifyService,
    private productService: ProductService
  ) {
    super(dialogRef);
  }

  @ViewChild("scanner", { static: true }) scanner: NgxScannerQrcodeComponent;
  @ViewChild("txtStock", { static: true }) txtStock: ElementRef;

  async ngOnInit() {
    this.scanner.start();
  }

  ngOnDestroy(): void {
    this.scanner.stop();
  }

  onEvent(e) {
    this.spinner.show(SpinnerType.BallSpinClockwiseFadeRotating);
    const data = e[0].value;
    if (data != null && data != "") {
      const jsonData = JSON.parse(data);
      const stockValue = (this.txtStock.nativeElement as HTMLInputElement).value;
      this.productService.updateProductStockWithQRCode(jsonData.Id, parseInt(stockValue), () => {
        $("#btnClose").click();
        this.spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating);
        this.alertify.message(`Stock of ${jsonData.Name} updated to ${stockValue}`, { messageType: MessageType.Success, position: Position.TopRight, dismissOthers: true });
        window.setTimeout(() => {
          location.href = "/admin/products"
        }, 2300);
      });
    }
  }

}


