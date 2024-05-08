import { Component, OnInit } from '@angular/core';
import { CustomerService, CustomerModel, IdentityService } from 'shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private customerService: CustomerService, private identityService: IdentityService) {}

  ngOnInit(): void {
    const user = this.identityService.get();
    console.log('OrderModule - user:', user);
    this.customerService.getAll().subscribe((customers: CustomerModel[]) => {
      console.log(customers);
    });
  }
}
