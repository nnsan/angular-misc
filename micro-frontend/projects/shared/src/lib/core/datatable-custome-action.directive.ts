import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[libDatatableCustomeAction]'
})
export class DatatableCustomeActionDirective implements OnInit, OnDestroy {

  @Input() action: Function | undefined;

  @Input() form: FormGroup | undefined;

  @Input() controlNames: string[] | undefined;

  private destroy$: Subject<void>;

  constructor(private elementRef: ElementRef) {
    this.destroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    if (this.action) {
      if (this.controlNames?.length) {
        const controls = this.controlNames.map((controlName) => {
          return this.form?.get(controlName);
        });

        this.action(this.elementRef, this.destroy$.asObservable(), controls);
      } else {
        this.action(this.elementRef, this.destroy$.asObservable());
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
