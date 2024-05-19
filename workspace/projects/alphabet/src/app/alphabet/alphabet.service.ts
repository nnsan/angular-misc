import { Injectable } from '@angular/core';
import { LessonService } from '../services/lesson.service';

@Injectable({
  providedIn: 'root'
})
export class AlphabetService extends LessonService {
  override questionDisplayFormat(lesson: string) {
    const [ uppercase, lowercase] = lesson.split('-');
    return lowercase ? `<span style="margin-right: 0.15em">${uppercase}</span><span style="font-size: 70%">${lowercase}</span>` : `<span>${uppercase}</span>`;
  }

  setAssetDir(language: string) {
    switch (language) {
      case 'vietnam':
        this.assetsDir = './assets/alphabet/vietnam/';
        break;
      case 'english':
        this.assetsDir = './assets/alphabet/english/';
        break;
      default:
        console.error('Language is not supported');
    }
  }
}
