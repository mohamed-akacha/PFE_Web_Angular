import { Component } from '@angular/core';
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username:string=""
  password:string=""
  loginError: string="";
constructor(private authService:AuthService) {
}

  login() {
    const credentials = {
      email: this.username,
      password: this.password
    };
console.log(credentials)
    this.authService.login(credentials).subscribe(
      response => {
        const { access_token, refresh_token } = response;
        this.authService.storeTokens({ access_token, refresh_token });
        window.location.href = "/dashboard/users";
      },
      error => {
        this.loginError = "Failed to login. Please check your credentials."+error.error.message;
      }
    );
  }
}
