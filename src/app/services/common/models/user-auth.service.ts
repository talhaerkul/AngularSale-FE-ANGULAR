import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { Token_Response } from 'src/app/contracts/token/tokan_response';
import { HttpClientService } from '../http-client.service';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private httpClient: HttpClientService) { }
  async login(UsernameOrEmail: string, Password: string, CallBackSuccess?: () => void): Promise<any> {
    const observable: Observable<any | Token_Response> = this.httpClient.post<any | Token_Response>({
      controller: "auth",
      action: "login"
    }, { UsernameOrEmail, Password })
    const tokenResponse: Token_Response = await firstValueFrom(observable) as Token_Response;
    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
    }
    CallBackSuccess();
  }
  async refreshTokenLogin(refreshToken: string, CallBackError?: () => void, CallBackSuccess?: () => void): Promise<any> {
    const observable: Observable<any | Token_Response> = this.httpClient.post<any | Token_Response>({
      controller: "auth",
      action: "refreshtokenlogin"
    }, { refreshToken: refreshToken });

    try {
      const tokenResponse: Token_Response = await firstValueFrom(observable) as Token_Response;

      if (tokenResponse) {
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
        localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
        CallBackSuccess();
      }
    } catch (error) {
      CallBackError();
    }

  }
  async googleLogin(user: SocialUser, CallBackSuccess?: () => void): Promise<any> {
    const observable: Observable<SocialUser | Token_Response> = this.httpClient.post<SocialUser | Token_Response>({
      action: "google-login",
      controller: "auth",
    }, user);

    const tokenResponse: Token_Response = await firstValueFrom(observable) as Token_Response;
    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
    }
    CallBackSuccess();
  }
  async facebookLogin(user: SocialUser, CallBackSuccess?: () => void): Promise<any> {
    const observable: Observable<SocialUser | Token_Response> = this.httpClient.post<SocialUser | Token_Response>({
      action: "facebook-login",
      controller: "auth",
    }, user);

    const tokenResponse: Token_Response = await firstValueFrom(observable) as Token_Response;
    if (tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);
      localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
    }
    CallBackSuccess();
  }

  async resetPassword(email: string, CallBack?: () => void) {
    const observable: Observable<any> = this.httpClient.post({
      controller: "auth",
      action: "reset-password"
    }, { email: email });
    await firstValueFrom(observable);
    CallBack();
  }

  async verifyResetToken(resetToken: string, userId: string, CallBack?: () => void): Promise<boolean> {
    const observable: Observable<any> = this.httpClient.post({
      controller: "auth",
      action: "verify-reset-token"
    }, { resetToken: resetToken, userId: userId });
    const state = await firstValueFrom(observable);
    CallBack();;
    return state;
  }
}
