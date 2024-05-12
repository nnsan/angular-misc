import { Component } from '@angular/core';
import { LessonService } from '../services/lesson.service';

@Component({
  selector: 'app-phonetics',
  standalone: true,
  imports: [],
  templateUrl: './phonetics.component.html',
  styleUrl: './phonetics.component.scss'
})
export class PhoneticsComponent {

  constructor(private lessonService: LessonService) {

  }

}
