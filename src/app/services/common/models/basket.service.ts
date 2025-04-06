import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { List_Basket_Item } from 'src/app/contracts/basket/list_basket_item';
import { Observable, firstValueFrom } from 'rxjs';
import { Create_Basket_Item } from 'src/app/contracts/basket/create_basket_item';
import { Update_Basket_Item } from 'src/app/contracts/basket/update_basket_item';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor(private httpClient: HttpClientService) { }
  async get(): Promise<List_Basket_Item[]> {
    const observable: Observable<List_Basket_Item[]> = this.httpClient.get({
      controller: "basket"
    });
    return await firstValueFrom(observable);
  }
  async create(basketItem: Create_Basket_Item): Promise<void> {
    const observable: Observable<any> = this.httpClient.post({
      controller: "basket"
    }, basketItem);
    await firstValueFrom(observable);
  }
  async updateQuantity(basketItem: Update_Basket_Item): Promise<void> {
    const observable: Observable<any> = this.httpClient.put({
      controller: "basket"
    }, basketItem);
    await firstValueFrom(observable);
  }
  async remove(basketItemId: string): Promise<void> {
    const observable: Observable<any> = this.httpClient.delete({
      controller: "basket",
    }, basketItemId);
    await firstValueFrom(observable);
  }
}
