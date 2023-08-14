import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  showVerificationCodeInput: number=0;

  verifyCode($event: string) {

  }

  showCodeForm(event: Event) {
    event.preventDefault();
    this.showVerificationCodeInput=1
  }

  showPwdForm(event: Event) {
    event.preventDefault();
    this.showVerificationCodeInput=2
  }
}
