import { Component, OnDestroy, OnInit } from '@angular/core';
import { PhonticsService } from './phontics.service';
import { CountdownTimerComponent } from '../countdown-timer/countdown-timer.component';
import { ScoreTableComponent } from '../score-table/score-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { SafeHtmlPipe } from '../alphabet/safe-html.pipe';
import { END_SIGNAL, LessonStatus } from '../services/utility';
import { PHONETICS_QUESTIONS } from './question';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { ILessonEmit } from '../services/lesson.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-phonetics',
  standalone: true,
  imports: [
    CountdownTimerComponent,
    ScoreTableComponent,
    MatButtonModule,
    MatDividerModule,
    SafeHtmlPipe
  ],
  templateUrl: './phonetics.component.html',
  styleUrl: './phonetics.component.scss'
})
export class PhoneticsComponent implements OnInit, OnDestroy {

  public thinkingTime: number;
  public resetTimer = new Subject<boolean>();

  public message: string;
  public imagePath: string;
  public score: number;
  public question: number;
  public totalScore: number;
  public needMorePractice: Set<string>;

  public status: LessonStatus;
  public LESSON_STATUS = LessonStatus;

  private lessonNotifySubscription!: Subscription;
  private section!: string;

  constructor(private lessonService: PhonticsService, private activatedRoute: ActivatedRoute) {
    this.thinkingTime = 3;
    this.score = 0;
    this.question = 0;
    this.totalScore = 0;
    this.message = '';
    this.imagePath = '';
    this.needMorePractice = new Set();
    this.status = LessonStatus.ReadyToStart;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (this.lessonNotifySubscription) {
        this.lessonNotifySubscription.unsubscribe();
      }
      this.section = params['section'];
      const questions = PHONETICS_QUESTIONS.get(this.section!);
      this.lessonService.setQuestionList(questions!);
      this.lessonService.stop();
      this.totalScore = questions!.length;
      this.question = 0;
      this.message = '';
      this.imagePath = '';
      this.status = LessonStatus.ReadyToStart;
      this.resetTimer.next(false);
    });
  }

  onTimesUp() {
    this.lessonService.nextQuestion();
  }

  onStart(event: MouseEvent) {
    event.stopPropagation();
    this.score = 0;
    this.question = 0;
    this.needMorePractice.clear();
    this.lessonService.start();

    this.lessonNotifySubscription = this.lessonService.notify.pipe(
      tap((value: ILessonEmit) => {
        if (value.unit === END_SIGNAL) {
          this.message = '';
          this.imagePath = '';
          this.status = LessonStatus.EndLesson;
        } else {
          this.status = LessonStatus.InProgress;
          this.message = value.format || '';
          this.imagePath = value.image ? `${this.lessonService.assetsDir}image/${value.image}` : '';
          this.needMorePractice.add(this.message);
          this.question += 1;
        }
      }),
    ).subscribe(async _ => {
      if (this.message) {
        await this.lessonService.readQuestion();
        this.resetTimer.next(true);
      }
    });
  }

  OnContinue(event: MouseEvent) {
    event.stopPropagation();
    this.score = 0;
    this.question = 0;
    this.needMorePractice.clear();

    this.lessonService.start();
  }

  onPause(event: MouseEvent) {
    this.status = LessonStatus.OnPause;
    this.lessonService.pause();
    event.stopPropagation();
  }

  onResume(event: MouseEvent) {
    this.status = LessonStatus.InProgress;
    this.lessonService.resume();
    event.stopPropagation();
  }

  getScore() {
    if (this.needMorePractice.has(this.message)) {
      this.needMorePractice.delete(this.message);
      this.score += 1;
    }
  }

  ngOnDestroy(): void {
    if (this.lessonNotifySubscription) {
      this.lessonNotifySubscription.unsubscribe();
    }
  }

}
