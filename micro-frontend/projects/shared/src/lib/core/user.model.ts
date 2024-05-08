export class UserModel {
  public username: string;
  public roles: string[];

  constructor() {
    this.username = "";
    this.roles = [];
  }
}
