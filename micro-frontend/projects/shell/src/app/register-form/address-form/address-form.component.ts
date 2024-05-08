import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
  @Input() form: FormGroup | any;

  ngOnInit(): void {
    this.form.addControl('street', new FormControl(''));
    this.form.addControl('city', new FormControl(''));
    this.form.addControl('state', new FormControl(''));
    this.form.addControl('zip', new FormControl(''));
  }
}
