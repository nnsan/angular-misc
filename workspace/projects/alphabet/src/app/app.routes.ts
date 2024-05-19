import { Routes } from '@angular/router';
import { AlphabetComponent } from './alphabet/alphabet.component';
import { PhoneticsComponent } from './phonetics/phonetics.component';
import { ClockLessonComponent } from './clock-lesson/clock-lesson.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'alphabet/vietnam'
  },
  {
    path: 'alphabet/:language',
    component: AlphabetComponent
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
