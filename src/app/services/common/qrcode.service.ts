import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QrcodeService {

  constructor(private httpClient: HttpClientService) { }

  async generateQRCode(id: string){
    const observable : Observable<Blob> = this.httpClient.get({
      controller: "products",
      action: "GetQRCodeToProductById",
      responseType: 'blob'
    }, id);
    return await firstValueFrom(observable);
  }
}
