import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { UserAuthService } from './models/user-auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {

  constructor(private toastr: CustomToastrService, private spinner: NgxSpinnerService,
    private userAuthService: UserAuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => {
      switch (error.status) {
        case HttpStatusCode.Unauthorized:
          const url = this.router.url
          if(localStorage.getItem("refreshToken") != null){
            debugger;
            this.userAuthService.refreshTokenLogin(localStorage.getItem("refreshToken"), () => {
              if (url == "/products") {
                this.toastr.message("Please Login!", "", { messageType: ToastrMessageType.Info, position: ToastrPosition.TopFullWidth })
              }
              if (url == "/admin/role" || url == "/admin/auth" || url == "/admin/users" || url == "/admin/products" || url == "/admin/orders") {
                window.location.href = "/admin/unauthorized";
              }
              else {
                this.toastr.message("Unauthorized operation!", "", { messageType: ToastrMessageType.Warning, position: ToastrPosition.BottomFullWidth })
                window.location.href = "/unauthorized";
              }
            }).then(data => { });
          }
          break;
        case HttpStatusCode.InternalServerError:
          this.toastr.message("Server is Unreachable!", "", { messageType: ToastrMessageType.Warning, position: ToastrPosition.BottomFullWidth })
          break;
        case HttpStatusCode.BadRequest:
          this.toastr.message("Invalid request!", "", { messageType: ToastrMessageType.Warning, position: ToastrPosition.BottomFullWidth })
          break;
        case HttpStatusCode.NotFound:
          this.toastr.message("Requested not found!", "", { messageType: ToastrMessageType.Warning, position: ToastrPosition.BottomFullWidth })
          break;
        case HttpStatusCode.MethodNotAllowed:
          break;
        default:
          this.toastr.message("Unexpected error occured!", "", { messageType: ToastrMessageType.Warning, position: ToastrPosition.BottomFullWidth })
          break;
      }
      this.spinner.hide(SpinnerType.BallAtom);
      this.spinner.hide(SpinnerType.BallScaleMultiple);
      this.spinner.hide(SpinnerType.BallSpinClockwiseFadeRotating);
      return of(error);
    }));
  }

}
