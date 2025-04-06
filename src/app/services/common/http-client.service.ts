import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private HttpClient: HttpClient, @Inject("baseUrl") private baseUrl: string) { }

  private Url(requestParameters: Partial<RequestParameters>): string {
    // baseurl/controller/action?
    return `${requestParameters.baseUrl ? requestParameters.baseUrl : this.baseUrl}/${requestParameters.controller}${requestParameters.action ? `/${requestParameters.action}` : ""}`;
  }

  get<T>(requestParameters: Partial<RequestParameters>, id?: string): Observable<T> {
    let url: string = "";
    if (requestParameters.fullEndPoint)
      url = `${requestParameters.fullEndPoint}`;
    else
      url = `${this.Url(requestParameters)}${id ? `/${id}` : ""}${requestParameters.queryString ? `?${requestParameters.queryString}` : ""}`;

    return this.HttpClient.get<T>(url, { headers: requestParameters.headers, responseType: requestParameters.responseType as 'json'});
  }
  post<T>(requestParameters: Partial<RequestParameters>, body: Partial<T>): Observable<T> {
    let url: string = "";
    if (requestParameters.fullEndPoint)
      url = `${requestParameters.fullEndPoint}`;
    else
      url = `${this.Url(requestParameters)}${requestParameters.queryString ? `?${requestParameters.queryString}` : ""}`;
    return this.HttpClient.post<T>(url, body, { headers: requestParameters.headers, responseType: requestParameters.responseType as 'json' });

  }
  put<T>(requestParameters: Partial<RequestParameters>, body: Partial<T>): Observable<T> {
    let url: string = "";
    if (requestParameters.fullEndPoint)
      url = `${requestParameters.fullEndPoint}`;
    else
      url = `${this.Url(requestParameters)}${requestParameters.queryString ? `?${requestParameters.queryString}` : ""}`;
    return this.HttpClient.put<T>(url, body, { headers: requestParameters.headers, responseType: requestParameters.responseType as 'json' });
  }
  delete<T>(requestParameters: Partial<RequestParameters>, id?: string): Observable<T> {
    let url: string = "";
    if (requestParameters.fullEndPoint)
      url = `${requestParameters.fullEndPoint}`;
    else
      url = `${this.Url(requestParameters)}/${id}${requestParameters.queryString ? `?${requestParameters.queryString}` : ""}`;

    return this.HttpClient.delete<T>(url, { headers: requestParameters.headers, responseType: requestParameters.responseType as 'json' });
  }

}

export class RequestParameters {
  controller?: string;
  action?: string;
  queryString?: string;

  headers?: HttpHeaders;
  baseUrl?: string;
  fullEndPoint?: string;

  responseType?: string = 'json';
}
