import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VietnameseLetterComponent } from './vietnamese-letter.component';

describe('VietnameseLetterComponent', () => {
  let component: VietnameseLetterComponent;
  let fixture: ComponentFixture<VietnameseLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VietnameseLetterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VietnameseLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
