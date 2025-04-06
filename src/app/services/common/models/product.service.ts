import { Injectable } from '@angular/core';
import { HttpClientService, RequestParameters } from '../http-client.service';
import { Create_Product } from 'src/app/contracts/products/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { List_Product } from 'src/app/contracts/products/list_product';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Product_Image } from 'src/app/contracts/products/list_product_image';
import { Category_List } from 'src/app/contracts/products/categories/category_list';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClientService) { }

  createProduct(product: Create_Product, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    this.httpClient.post({ controller: "products" }, product)
      .subscribe(result => {
        successCallBack();

      },
        (errorResponse: HttpErrorResponse) => {
          const _error: Array<{ key: string, value: Array<string> }> = errorResponse.error;
          let message = "";
          // tek satırlık iç içe 2 forech ile valuelerin value adı altında mesajlarına eriştik
          _error.forEach((v, index) => { v.value.forEach((_v, _index) => { message += `${_v}<br>` }) });
          errorCallBack(message);
        });
  }

  async createcategory(category: string, CallBackSuccess?: () => void) {
    const observable: Observable<any> = await this.httpClient.post({
      controller: "products",
      action: "CreateCategory"
    }, { category: category });
    await firstValueFrom(observable);
    CallBackSuccess();
  }
  async addProductToCategories(id : string, categories: Category_List[], CallBackSuccess?: () => void) {
    const observable: Observable<any> = await this.httpClient.post({
      controller: "products",
      action: "addProductToCategories"
    }, { id: id, categories: categories });
    await firstValueFrom(observable);
    CallBackSuccess();
  }
  async getCategories(successCallBack?: () => void): Promise<{categories: Category_List[]}> {
    const observable: Observable<{categories: Category_List[]}> = this.httpClient.get<{categories: Category_List[]}>({
      action: "getCategories",
      controller: "products"
    });
    const promiseData = firstValueFrom(observable);
    promiseData.then(() => successCallBack());
    return await promiseData;
  }
  async getCategoriesByProductId(id: string): Promise<{categories: Category_List[]}> {
    const observable: Observable<{categories: Category_List[]}> = this.httpClient.get<{categories: Category_List[]}>({
      action: "getCategoriesByProductId",
      controller: "products"
    },id);
    return await firstValueFrom(observable);
  }

  async getProducts(page: number = 0, size: number = 13, action: string,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void): Promise<{ totalCount: number, products: List_Product[] }> {
    const promisData: Promise<{ totalCount: number, products: List_Product[] }> = this.httpClient
      .get<{ totalCount: number, products: List_Product[] }>({
        controller: "products",
        action: action,
        queryString: `page=${page}&size=${size}`
      }).toPromise();

    promisData.then(() => successCallBack()).catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));
    return await promisData;
  }

  async getProductById(id: string, successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void): Promise<List_Product> {
    const observable: Observable<List_Product> = this.httpClient.get<List_Product>({
      controller: "products",
      action: "GetProductById"
    }, id);
    const promiseData = firstValueFrom(observable);
    promiseData.then(() => successCallBack()).catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));
    return await promiseData;
  }
  async getProductsByCategory(page: number = 0, size: number = 18, category: string,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void): Promise<{ totalCount: number, products: List_Product[] }> {
    const observable: Observable<{ totalCount: number, products: List_Product[] }> = this.httpClient
      .get<{ totalCount: number, products: List_Product[] }>({
        controller: "products",
        action: "GetProductsByCategory",
        queryString: `page=${page}&size=${size}`
      },category);
    const promiseData = firstValueFrom(observable);
    promiseData.then(() => successCallBack());
    return await promiseData;
  }
  async getProductsByBrand(page: number = 0, size: number = 18, brand: string,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void): Promise<{ totalCount: number, products: List_Product[] }> {
    const observable: Observable<{ totalCount: number, products: List_Product[] }> = this.httpClient
      .get<{ totalCount: number, products: List_Product[] }>({
        controller: "products",
        action: "GetProductsByBrand",
        queryString: `page=${page}&size=${size}`
      }, brand);
    const promiseData = firstValueFrom(observable);
    promiseData.then(() => successCallBack());
    return await promiseData;
  }
  async getProductsBySaler(page: number = 0, size: number = 18, saler: string,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void): Promise<{ totalCount: number, products: List_Product[] }> {
    const observable: Observable<{ totalCount: number, products: List_Product[] }> = this.httpClient
      .get<{ totalCount: number, products: List_Product[] }>({
        controller: "products",
        action: "GetProductsBySaler",
        queryString: `page=${page}&size=${size}`
      }, saler);
    const promiseData = firstValueFrom(observable);
    promiseData.then(() => successCallBack());
    return await promiseData;
  }
  async getShowcaseBySaler(page: number = 0, size: number = 18, saler: string,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void): Promise<{ totalCount: number, products: List_Product[] }> {
    const observable: Observable<{ totalCount: number, products: List_Product[] }> = this.httpClient
      .get<{ totalCount: number, products: List_Product[] }>({
        controller: "products",
        action: "getShowcaseBySaler",
        queryString: `page=${page}&size=${size}`
      }, saler);
    const promiseData = firstValueFrom(observable);
    promiseData.then(() => successCallBack());
    return await promiseData;
  }
  async delete(id: string) {
    const deleteObservable = await this.httpClient.delete({ controller: "products" }, id);
    await firstValueFrom(deleteObservable);
  }

  async readImages(id: string, successCallBack?: () => void): Promise<List_Product_Image[]> {
    const getObservable: Observable<List_Product_Image[]> = this.httpClient.get<List_Product_Image[]>({
      action: "getproductimages",
      controller: "products",
    }, id);
    const promiseData = firstValueFrom(getObservable);
    promiseData.then(() => successCallBack());
    return await promiseData;
  }
  async deleteImage(productId: string, imageId: string, successCallBack?: () => void) {
    const deleteObservable = this.httpClient.delete({
      action: "deleteproductimage",
      controller: "products",
      queryString: `imageId=${imageId}`
    }, productId)
    await firstValueFrom(deleteObservable);
    successCallBack();
  }
  async changeShowcaseImage(imageId: string, productId: string, successCallBack?: () => void) {
    const showcaseObservable = this.httpClient.get({
      controller: "products",
      action: "ChangeShowcaseImage",
      queryString: `imageId=${imageId}&productId=${productId}`
    });
    await firstValueFrom(showcaseObservable);
    successCallBack();
  }

  async updateProductStockWithQRCode(id: string, stock: number, successCallBack?: () => void) {
    const observable = this.httpClient.post({
      controller: "products",
      action: "UpdateProductStockWithQRCode",
    }, { id: id, stock: stock });
    await firstValueFrom(observable);
    successCallBack();
  }
  async updateProduct(product: List_Product, successCallBack?: () => void) {
    const observable = this.httpClient.put({
      controller: "products",
      action: "UpdateProduct",
    }, product);
    await firstValueFrom(observable);
    successCallBack();
  }


}
