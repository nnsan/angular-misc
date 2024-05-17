import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockLessonComponent } from './clock-lesson.component';

describe('ClockLessonComponent', () => {
  let component: ClockLessonComponent;
  let fixture: ComponentFixture<ClockLessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClockLessonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClockLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
