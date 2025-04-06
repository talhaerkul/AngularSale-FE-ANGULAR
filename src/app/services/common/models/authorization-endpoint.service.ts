import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationEndpointService {

  constructor(private httpClient: HttpClientService) { }

  async assignRoleEndpoint(roles: string[], code: string, menu: string, successCallBack?: () => void
    ) {
    const observable: Observable<any> = this.httpClient.post({
      controller: "AuthorizationEndpoints",
      action: "AssignRoleEndpoint"
    }, { roles: roles, code: code, menu: menu });
    const promiseData = observable.subscribe({
      next: successCallBack
    })
    await promiseData;
  }

  async getRolesToEndpoint(code: string, menu: string, successCallBack?: () => void,
    ) : Promise<string[]> {
    const observable: Observable<any> = this.httpClient.post({
      controller: "AuthorizationEndpoints",
      action: "GetRolesToEndpoint"
    }, { code: code, menu: menu });
    const promiseData = firstValueFrom(observable);
    promiseData.then(d => successCallBack());
    return await promiseData;
  }
}
