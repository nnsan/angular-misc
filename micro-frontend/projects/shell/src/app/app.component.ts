import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface IMenuItem {
  name: string;
  routerLink: string;
  isActive: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'shell';
  public menuItems: IMenuItem[];

  constructor(private router: Router) {
    this.menuItems = [];
  }

  ngOnInit(): void {
    this.menuItems = [
      {name: 'home', routerLink: '', isActive: true},
      {name: 'customer', routerLink: '/customer', isActive: false},
      {name: 'other', routerLink: '/others', isActive: false},
    ];
  }

  public navMenuItem(item: IMenuItem) {
    this.menuItems = this.menuItems.map(item => {
      item.isActive = item.name !== item.name;
      return item;
    });
    this.router.navigate([item.routerLink]);
  }
}
