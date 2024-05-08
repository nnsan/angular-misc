import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { SharedModule, MockApiDataService } from 'shared';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterFormComponent } from './register-form/register-form.component';
import { AddressFormComponent } from './register-form/address-form/address-form.component';

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    NotFoundComponent,
    RegisterFormComponent,
    AddressFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientInMemoryWebApiModule.forRoot(MockApiDataService)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
