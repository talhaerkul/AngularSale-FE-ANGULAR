import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent extends BaseComponent implements OnInit {
  constructor(spinner: NgxSpinnerService, private userAuthService: UserAuthService, private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder, private userService: UserService, private toastr: CustomToastrService) {
    super(spinner);

  }
  state: any;
  formRegister: FormGroup
  ngOnInit() {
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    this.activatedRoute.params.subscribe({
      next: async params => {
        const userId: string = params["userId"];
        const resetToken: string = params["resetToken"];
        this.state = await this.userAuthService.verifyResetToken(resetToken, userId, () => {
          this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
        });
      }
    });

    this.formRegister = this.formBuilder.group({
      Password: ["", [
        Validators.required,
      ]],
      PasswordConfirm: ["", [
        Validators.required,
      ]]
    },
      {
        validator: this.ConfirmedValidator('Password', 'PasswordConfirm')
      }
    )
  }
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  // c# daki promp
  get component() {
    return this.formRegister.controls;
  }
  submitted: boolean = false;

  approve(password: string, passwordConfirm: string) {
    this.submitted = true;
    if (this.formRegister.invalid) {
      return;
    }
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    this.activatedRoute.params.subscribe({
      next: async params => {
        const userId: string = params["userId"];
        const resetToken: string = params["resetToken"];
        await this.userService.updatePassword(userId, resetToken, password, passwordConfirm,
          () => {
            this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
            this.toastr.message("Password Changed!", "", { messageType: ToastrMessageType.Success , position: ToastrPosition.TopFullWidth});
            this.showSpinnerWithTime(SpinnerType.BallAtom, 1800);
            window.setTimeout(function () { location.href = '/login'; }, 2000);
          });
      }
    });
  }
}
