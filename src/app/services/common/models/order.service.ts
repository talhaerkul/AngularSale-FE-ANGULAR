import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Order } from 'src/app/contracts/order/create_order';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Order } from 'src/app/contracts/order/list_order';
import { HttpErrorResponse } from '@angular/common/http';
import { Single_Order } from 'src/app/contracts/order/single_order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClientService) { }

  async create(order: Create_Order, CallBackSuccess?: () => void) {
    const observable: Observable<any> = await this.httpClient.post({
      controller: "orders",
    }, order);
    await firstValueFrom(observable);
    CallBackSuccess();
  }

  async getAllOrders(page: number = 0, size: number = 13, successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void): Promise<{ totalCount: number, orders: List_Order[] }> {
    const observable: Observable<{ totalCount: number, orders: List_Order[] }> = await this.httpClient.get<{ totalCount: number, orders: List_Order[] }>({
      controller: "orders",
      queryString: `page=${page}&size=${size}`
    });

    const promiseData = firstValueFrom(observable);
    promiseData.then(d => successCallBack()).catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));

    return await promiseData;
  }
  async getOrderById(id: string, successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void) {
    const observable: Observable<Single_Order> = this.httpClient.get<Single_Order>({
      controller: "orders",
    }, id);
    const promiseData = firstValueFrom(observable);
    promiseData.then(d => successCallBack()).catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));
    return await promiseData;
  }
  async completeOrder(id: string, CallBack?: () => void) {
    const observable: Observable<any> = this.httpClient.get({
      controller: "orders",
      action: "complete-order"
    }, id);
    await firstValueFrom(observable);
    CallBack();
  }
}
