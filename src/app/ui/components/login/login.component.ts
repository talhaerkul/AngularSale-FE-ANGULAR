import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { ResetPasswordDialogComponent, ResetPasswordState } from 'src/app/dialogs/reset-password-dialog/reset-password-dialog.component';
import { AuthService, _isAuthenticated } from 'src/app/services/common/auth.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit{


  constructor(private userAuthService: UserAuthService, spinner: NgxSpinnerService,
    private authService: AuthService, private activatedRoute: ActivatedRoute,
    private socialAuthService: SocialAuthService, private dialogService: DialogService) {
    super(spinner);

    this.socialAuthService.authState.subscribe(async (user: SocialUser) => {
      this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating)
      switch (user.provider) {
        case "GOOGLE":
          await this.userAuthService.googleLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
          });
          break;
        case "FACEBOOK":
          await this.userAuthService.facebookLogin(user, () => {
            this.authService.identityCheck();
            this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
          });
          break;
      }

      this.activatedRoute.queryParams.subscribe(params => {
        const returnUrl: string = params["returnUrl"];
        if (returnUrl) {
          window.location.href = `${returnUrl}`;
        }
        else
          window.location.href = ``;
      });

    });
  }
  ngOnInit(): void {
    if (_isAuthenticated) {
      window.location.href = "";
    }
  }
  async login(usernameOrEmail: string, password: string) {
    this.showSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    await this.userAuthService.login(usernameOrEmail, password, () => {
      this.authService.identityCheck();
      this.activatedRoute.queryParams.subscribe(params => {
        const returnUrl: string = params["returnUrl"];
        if (returnUrl) {
          window.location.href = `${returnUrl}`;
        }
        else
          window.location.href = ``;
      });
      this.hideSpinner(SpinnerType.BallSpinClockwiseFadeRotating);
    });
  }

  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  resetPassword(){
    this.dialogService.openDialog({
      componentType: ResetPasswordDialogComponent,
      data: ResetPasswordState.Send,
      options: {
        width: "500px",

      }
    });
  }

}
