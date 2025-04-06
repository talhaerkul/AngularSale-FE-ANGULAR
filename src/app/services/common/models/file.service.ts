import { Injectable } from '@angular/core';
import { HttpClientService, RequestParameters } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { BaseUrl } from 'src/app/contracts/baseUrl/base-url';


@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClient: HttpClientService){ }
  async getBaseStorageUrl() : Promise<BaseUrl> {
    const getObservable: Observable<BaseUrl> = this.httpClient.get<BaseUrl>({
      controller: "files"
    });
    return await firstValueFrom(getObservable);
  }
}
