import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShellService {

  constructor() {
    console.log(`environment.production: ${environment.production}`);
  }

  public doSomething() {
    console.log('TODO');
  }
}
