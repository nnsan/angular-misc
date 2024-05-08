import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { CustomerModel } from './customer.model';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient: HttpClient) {
    console.log(`environment.production: ${environment.production}`);
  }

  public getAll(): Observable<CustomerModel[]> {
    return this.httpClient.get<CustomerModel[]>(environment.api.customer.getAll).pipe(tap(x => console.log(x)));
  }
}
