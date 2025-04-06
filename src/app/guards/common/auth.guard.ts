import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { _isAuthenticated } from 'src/app/services/common/auth.service';
import { HttpErrorHandlerInterceptorService } from 'src/app/services/common/http-error-handler-interceptor.service';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';



export const AuthGuard: CanActivateFn = (route, state) => {
  authCheck(route, state);
  return true;
};

export const AuthChildGuard: CanActivateChildFn = (route, state) => {
  authCheck(route, state);
  return true;
}

function authCheck(route, state) {
  const router = inject(Router);
  const spinner = inject(NgxSpinnerService);
  const toastr = inject(CustomToastrService);
  const userAuthService = inject(UserAuthService);
  const jwtHelper = inject(JwtHelperService);

  spinner.show(SpinnerType.BallSpinClockwiseFadeRotating);

  if (!_isAuthenticated) {
    let refreshToken: string = localStorage.getItem("refreshToken");
    if (refreshToken) {
      userAuthService.refreshTokenLogin(refreshToken, () => {
        toastr.message("Unauthorized operation!", "", { messageType: ToastrMessageType.Warning, position: ToastrPosition.BottomFullWidth });
        router.navigate(["login"]);
      }, () => { toastr.message("Session updated. Try Again!", "", { messageType: ToastrMessageType.Info, position: ToastrPosition.BottomFullWidth }); })
        .then(data => { });
    }
    else {
      toastr.message("Unauthorized operation!", "", { messageType: ToastrMessageType.Warning, position: ToastrPosition.BottomFullWidth });
      router.navigate(["login"]);
    }

  }
  spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating);
}
