import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { UiModule } from './ui/ui.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { SpinnerComponent } from './base/spinner/spinner.component';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './ui/components/login/login.component';
import { FacebookLoginProvider, GoogleLoginProvider, GoogleSigninButtonModule, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { HttpErrorHandlerInterceptorService } from './services/common/http-error-handler-interceptor.service';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';



@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    LoginComponent,
    DynamicLoadComponentDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    //
    AdminModule,
    UiModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    HttpClientModule,
    MatIconModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem("accessToken"),
        allowedDomains: ["localhost:7036"],
        disallowedRoutes: [""]
      }
    }),
    SocialLoginModule,
    GoogleSigninButtonModule
    //
  ],
  providers: [
    //
    {provide: "baseUrl", useValue: "https://localhost:7036/api", multi: true},
    {provide: "domainUrl", useValue: "https://localhost:7036", multi: true},
    //
    {provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider("724328797531-3mnu6fstsbo6kfhls3354jbeapnorfkm.apps.googleusercontent.com")
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider("829802968376565")
          }
        ],
        onError: err => console.log(err)
      } as SocialAuthServiceConfig
    },
    //
    {provide: HTTP_INTERCEPTORS, useClass:HttpErrorHandlerInterceptorService, multi: true}
    //
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
