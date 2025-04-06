import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_User } from 'src/app/contracts/users/create_user';
import { Create_User_Response } from 'src/app/contracts/users/create_user_response';
import { _isAuthenticated } from 'src/app/services/common/auth.service';
import { UserService } from 'src/app/services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private toastrService: CustomToastrService, spinner: NgxSpinnerService) {
    super(spinner);
  }
  formRegister: FormGroup
  ngOnInit(): void {

    if (_isAuthenticated) {
      window.location.href = "";
    }

    this.formRegister = this.formBuilder.group({
      Name: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3)
      ]],
      Username: ["", [
        Validators.required,
        Validators.maxLength(15),
        Validators.minLength(5)
      ]],
      Email: ["", [
        Validators.required,
        Validators.maxLength(50),
        Validators.email
      ]],
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
  loginLink: string = "";

  submitted: boolean = false;
  async onSubmit(user: Create_User) {
    this.submitted = true;
    if (this.formRegister.invalid) {
      return;
    }


    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    const result: Create_User_Response = await this.userService.create(user, () => { this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating) });
    if (result.succeeded) {
      this.toastrService.message(result.message, "Success", { messageType: ToastrMessageType.Success, position: ToastrPosition.TopFullWidth })
      this.showSpinnerWithTime(SpinnerType.BallScaleMultiple, 1000);
      window.setTimeout(function () { location.href = '/login'; }, 1200);
    }
    else
      this.toastrService.message(result.message, "Error", { messageType: ToastrMessageType.Error, position: ToastrPosition.TopRight })
  }

}
