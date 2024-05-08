import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService implements InMemoryDbService {

  constructor() { }

  public createDb() {
    const customer = [
      {id: 1, username: 'user1', email: 'user1@gmail.com'},
      {id: 2, username: 'user2', email: 'user2@gmail.com'},
      {id: 3, username: 'user2', email: 'user3@gmail.com'},
    ];

    return {
      customer
    }
  }
}
