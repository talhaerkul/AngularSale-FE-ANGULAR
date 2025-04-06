import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { List_Role } from 'src/app/contracts/role/list_role';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClient: HttpClientService) { }

  async getRoles(page: number, size: number,callBackSuccess?: ()=> void) {
    const observable: Observable<any> = await this.httpClient.get({
      controller: "roles",
      queryString: `page=${page}&size=${size}`
    });
    var promiseData = firstValueFrom(observable);
    promiseData.then(d => callBackSuccess());
    return await promiseData;
  }

  async create(name: string, callBackSuccess?: () => void) {
    const observable: Observable<any> = await this.httpClient.post({
      controller: "roles"
    }, { name: name });

    var promiseData = firstValueFrom(observable);
    promiseData.then(d => callBackSuccess());
    return await promiseData as {succeded : boolean};
  }

}
