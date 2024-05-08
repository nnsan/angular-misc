import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[libNumberFormat]'
})
export class NumberFormatDirective implements OnInit {

  @Input() currencyRegex: RegExp | undefined;

  private regex: RegExp = /^\d{1,4}(\.(\d{1,2})?)?/;
  private previousValue = '';

  constructor(private el: ElementRef, private control: NgControl) {}

  ngOnInit(): void {
    if (`${this.control.value}`.length) {
      this.el.nativeElement.value = this.transformCurrency(this.control.value);
      this.previousValue = this.control.value;
    }

    if (this.currencyRegex) {
      this.regex = this.currencyRegex;
    }
  }

  @HostListener('focus', ['$event.target.value'])
  onInputFocus(value: any) {
    this.el.nativeElement.value = value.replace(/\$|\,/g, '');
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = event.target as HTMLInputElement;
    let trimmedValue = input.value.trim();

    const match = this.regex.exec(trimmedValue);

    if (!trimmedValue || match && match['0'] == trimmedValue) {
      this.previousValue = trimmedValue;
    } else {
      input.value = this.previousValue;
      event.preventDefault();
    }
  }

  @HostListener('blur', ['$event'])
  onInputValue(event: any) {
    const value = event.target.value;
    const formattedValue = this.transformCurrency(value);

    this.el.nativeElement.value = formattedValue;
    this.el.nativeElement.selectionStart = this.el.nativeElement.selectionEnd = formattedValue.length;

    this.control.control!.setValue(formattedValue.replace(/\$|\,/g, ''), {emitModelToViewChange: false });
  }

  private transformCurrency(value: string) {
    const parts = `${value}`.split('.');
    let formattedValue = value;

    if (parts.length && parts[0].length) {
      formattedValue = `$${new Intl.NumberFormat().format(+parts[0])}`;

      if (parts[1] && parts[1].length) {
        formattedValue += `.${parts[1]}`;
      }
    } else {
      formattedValue = '';
    }

    return formattedValue;
  }
}
