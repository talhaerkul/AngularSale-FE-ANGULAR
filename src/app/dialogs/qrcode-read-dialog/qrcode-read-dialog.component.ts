import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BaseDialog } from '../base/base-dialog';
import { QrcodeService } from 'src/app/services/common/qrcode.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService } from 'src/app/services/admin/alertify.service';
import { ProductService } from 'src/app/services/common/models/product.service';
import { SpinnerType } from 'src/app/base/base.component';

@Component({
  selector: 'app-qrcode-read-dialog',
  templateUrl: './qrcode-read-dialog.component.html',
  styleUrls: ['./qrcode-read-dialog.component.scss']
})
export class QrcodeReadDialogComponent extends BaseDialog<QrcodeReadDialogComponent> implements OnInit, OnDestroy {

  constructor(
    dialogRef: MatDialogRef<QrcodeReadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private qrCodeService: QrcodeService,
    private domSanitizer: DomSanitizer, private spinner: NgxSpinnerService, private alertify: AlertifyService,
    private productService: ProductService
  ) {
    super(dialogRef);
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  async ngOnInit() {
    this.spinner.show(SpinnerType.BallSpinClockwiseFadeRotating);
    const qrCodeBlob: Blob = await this.qrCodeService.generateQRCode(this.data as string);
    const url: string = URL.createObjectURL(qrCodeBlob);
    this.qrCodeSafeUrl = this.domSanitizer.bypassSecurityTrustUrl(url);
    this.spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating);
  }
  qrCodeSafeUrl: SafeUrl;

}
