import { Injectable } from '@angular/core';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {
  private readonly user: UserModel;

  constructor() {
    this.user = new UserModel();
  }

  public set(userData: UserModel) {
    this.user.username = userData.username;
    this.user.roles = userData.roles;
  }

  public get(): UserModel {
    return this.user;
  };
}
