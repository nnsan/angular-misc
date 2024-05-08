import { Component } from '@angular/core';
import { CustomerModel, CustomerService } from 'shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private customerService: CustomerService) {
    this.customerService.getAll().subscribe((users: CustomerModel[]) => {
      console.log(`this is users data`, users);
    });
  }

}
