import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-verification-code-input',
  templateUrl: './verification-code-input.component.html',
  styleUrls: ['./verification-code-input.component.scss']
})
export class VerificationCodeInputComponent {
  @Output() codeEntered: EventEmitter<string> = new EventEmitter<string>();

  codeDigits: string[] = ['', '', '', '', ''];
  currentIndex: number = 0;

  onKeyDown(event: KeyboardEvent, index: number) {
    const key = event.key;

    if (key === 'Backspace') {
      event.preventDefault();
      this.removeDigit(index);
    } else if (key.length === 1 && /^\d$/.test(key)) {
      event.preventDefault();
      this.addDigit(key, index);
    }

    this.focusNext(index);
  }

  addDigit(digit: string, index: number) {
    this.codeDigits[index] = digit;
    if (this.codeDigits.every(d => d !== '')) {
      const code = this.codeDigits.join('');
      this.codeEntered.emit(code);
    }
  }

  removeDigit(index: number) {
    if (index > 0) {
      this.codeDigits[index] = '';
      this.currentIndex = index - 1;
    } else {
      this.codeDigits = ['', '', '', '', ''];
      this.currentIndex = 0;
    }
  }

  focusNext(index: number) {
    if (index < this.codeDigits.length - 1) {
      this.currentIndex = index + 1;
    }
  }
}
