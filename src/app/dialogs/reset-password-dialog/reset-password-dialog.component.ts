import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.scss']
})
export class ResetPasswordDialogComponent extends BaseDialog<ResetPasswordDialogComponent>{
  constructor(
    dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResetPasswordState,
    private userAuthService: UserAuthService, private toastr: CustomToastrService, private spinner: NgxSpinnerService
  ) {
    super(dialogRef);
  }
  send(email: string){
    this.spinner.show(SpinnerType.BallSpinClockwiseFadeRotating);
    this.userAuthService.resetPassword(email,() => {
      this.toastr.message("Reset link sent to entered email!","",{messageType: ToastrMessageType.Info, position: ToastrPosition.TopFullWidth});
      this.spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating);
    })
  }
}

export enum ResetPasswordState
{
  Send,
  Cancel
}
