import { Component, ElementRef, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { egmConfigurationInSyncVariationAndJackpotValidation } from '../utils/form-validation'
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  public registerForm = this.formBuilder.group({
    firstName: [''],
    lastName: ['Nguyen'],
    email: ['', [Validators.email]],
    donate: ['', {
      updateOn: 'blur',
      validations: [Validators.required]
    }],
    address: this.formBuilder.group({})
  }, {validators: egmConfigurationInSyncVariationAndJackpotValidation});

  public currencyPattern = /^\d{1,8}(\.(\d{1,2})?)?/;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const donateControl = this.registerForm.get('donate')!;
    donateControl.valueChanges.subscribe((value: string | null) => {
      console.log(`donate valueChanges: ${value}`);
    });
  }

  public onSubmit() {
    console.log(this.registerForm.value);
  }

  public getError(errorKeys: string) {
    return 'get error';
  }

  public onReadonly() {
    this.registerForm.get('firstName')
  }

  public emailAction(element: ElementRef, destroy$: Observable<void>, args: AbstractControl[]) {
    const donate = args[1];
    const email = args[0];

    donate.valueChanges.pipe(
      takeUntil(destroy$),
      distinctUntilChanged()
    ).subscribe((value) => {
      if (value == 2) {
        email.disable();
      } else {
        email.enable();
      }
    })
  }

  public gameRPT(element: ElementRef, destroy$: Observable<void>, args: AbstractControl[]) {
    const donate = args[0];
    donate.valueChanges.pipe(
      takeUntil(destroy$),
      distinctUntilChanged()
    ).subscribe((value) => {
      element.nativeElement.innerHTML = value;
    })
  }
}
