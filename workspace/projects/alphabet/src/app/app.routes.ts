import { Routes } from '@angular/router';
import { VietnameseLetterComponent } from './vietnamese-letter/vietnamese-letter.component';
import { PhoneticsComponent } from './phonetics/phonetics.component';
import { ClockLessonComponent } from './clock-lesson/clock-lesson.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'vietnamese-letter'
  },
  {
    path: 'vietnamese-letter',
    component: VietnameseLetterComponent
  },
  {
    path: 'phonetics/:section',
    component: PhoneticsComponent
  },
  {
    path: 'analog-clock',
    component: ClockLessonComponent
  }
];
