import { Component } from '@angular/core';
import { ShellService, IdentityService } from 'shared';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public email: FormControl;

  constructor(private shellService: ShellService, private identityService: IdentityService) {
    this.shellService.doSomething();
    this.identityService.set({username: 'San Nguyen', roles: ['Admin']});

    this.email = new FormControl('', [Validators.required, Validators.email]);
  }

  public getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }
}
