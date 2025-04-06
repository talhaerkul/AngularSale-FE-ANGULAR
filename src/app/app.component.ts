import { Component } from '@angular/core';
import { AuthService } from './services/common/auth.service';
import { HttpClientService } from './services/common/http-client.service';

//jquery ekleme kodu
declare var $: any
//

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AngularSaleClient';

  constructor( private authService: AuthService, private http: HttpClientService) {
    authService.identityCheck();
  }
}
