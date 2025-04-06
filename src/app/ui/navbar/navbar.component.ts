import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/common/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(public authService: AuthService) {
    authService.identityCheck();
  }
  signOut() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    this.authService.identityCheck();
    window.location.href = ``;
  };
}
