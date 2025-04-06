import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Menu } from 'src/app/contracts/application-configurations/menu';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private httpClient: HttpClientService) { }

  async getAuthorizeDefinitionEndpoints(){
  const observable: Observable<Menu[]> = this.httpClient.get<Menu[]>({
    controller: "ApplicationServices",
  });
  return await firstValueFrom(observable);
  }
}
