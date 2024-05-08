import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { OrderModule } from './order/order.module';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { MockApiDataService } from 'shared';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OrderModule,
    HttpClientInMemoryWebApiModule.forRoot(MockApiDataService)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
