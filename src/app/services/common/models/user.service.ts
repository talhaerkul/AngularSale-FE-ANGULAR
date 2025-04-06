import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_User } from 'src/app/contracts/users/create_user';
import { Create_User_Response } from 'src/app/contracts/users/create_user_response';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { List_User } from 'src/app/contracts/users/list_user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClientService) { }

  async create(user: Create_User, CallBackSuccess: () => void) : Promise<Create_User_Response> {
    const observable: Observable<Create_User_Response | Create_User> = this.httpClient.post<Create_User_Response | Create_User>({
      controller: "users"
    },user);
    const response = await firstValueFrom(observable) as Create_User_Response
    CallBackSuccess();
    return response;
  }

  async updatePassword(userId: string, resetToken: string, password: string, passwordConfirm: string, successCallBack?: () => void,
  errorCallBack?: (errorMessage: string) => void){
    const observable: Observable<any> = this.httpClient.post({
      controller: "users",
      action: "update-password"
    },{userId: userId, password: password, passwordConfirm: passwordConfirm, resetToken: resetToken});
    const promiseData = firstValueFrom(observable);
    promiseData.then(d => successCallBack()).catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));
    await promiseData;
  }

  async getAllUsers(page: number = 0, size: number = 13, successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void): Promise<{ totalCount: number, users: List_User[] }> {
    const observable: Observable<{ totalCount: number, users: List_User[] }> = await this.httpClient.get<{ totalCount: number, users: List_User[] }>({
      controller: "users",
      queryString: `page=${page}&size=${size}`
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(d => successCallBack()).catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));

    return await promiseData;
  }

  async assignRoleUser(roles: string[], id: string, successCallBack?: () => void
    ) {
    const observable: Observable<any> = this.httpClient.post({
      controller: "users",
      action: "AssignRoleUser"
    }, { roles: roles, userId: id });
    const promiseData = observable.subscribe({
      next: successCallBack
    })
    await promiseData;
  }

  async getRolesToUser(id: string, successCallBack?: () => void,
    ) : Promise<string[]> {
    const observable: Observable<any> = this.httpClient.get({
      controller: "users",
      action: "GetRolesToUser"
    }, id);
    const promiseData = firstValueFrom(observable);
    promiseData.then(d => successCallBack());
    return await promiseData;
  }

}
