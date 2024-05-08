import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { NumberFormatDirective } from './core/number-format.directive';
import { FormControlErrorMsgPipe } from './core/form-control-error-msg.pipe';
import { DatatableCustomeActionDirective } from './core/datatable-custome-action.directive';


@NgModule({
  declarations: [
    NumberFormatDirective,
    FormControlErrorMsgPipe,
    DatatableCustomeActionDirective,
  ],
  imports: [
    HttpClientModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
  ],
  exports: [
    NumberFormatDirective,
    FormControlErrorMsgPipe,
    MatSlideToggleModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    DatatableCustomeActionDirective,
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'fill'}}
  ]
})
export class SharedModule { }
