import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {RouterModule, RouterOutlet, Routes} from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerificationCodeInputComponent } from './verification-code-input/verification-code-input.component';
const routes:Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'reset', component: ResetPasswordComponent }
      ]
  }
 ]

@NgModule({
  declarations: [LoginComponent,AuthLayoutComponent, ResetPasswordComponent, VerificationCodeInputComponent],
  imports: [CommonModule,RouterModule.forChild(routes),FormsModule,HttpClientModule],
  exports:[LoginComponent]
})
export class AuthModule { }
