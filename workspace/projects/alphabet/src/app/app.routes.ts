import { Routes } from '@angular/router';
import { VietnameseLetterComponent } from './vietnamese-letter/vietnamese-letter.component';
import { PhoneticsComponent } from './phonetics/phonetics.component';

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
  }
];
