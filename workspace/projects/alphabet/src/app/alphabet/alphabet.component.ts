import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { AlphabetService } from './alphabet.service';
import { ENGLISH_QUESTIONS, VIETNAMESE_QUESTIONS } from './question';
import { CountdownTimerComponent } from '../countdown-timer/countdown-timer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ScoreTableComponent } from '../score-table/score-table.component';
import { END_SIGNAL, LessonStatus } from '../services/utility'
import { tap } from 'rxjs/operators';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ILessonEmit } from '../services/lesson.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-vietnamese-letter',
  standalone: true,
  imports: [
    CountdownTimerComponent,
    ScoreTableComponent,
    MatButtonModule,
    MatDividerModule,
    SafeHtmlPipe
  ],
  templateUrl: './alphabet.component.html',
  styleUrl: './alphabet.component.scss'
})
export class AlphabetComponent implements OnInit, OnDestroy {
  public thinkingTime: number;
  public resetTimer = new Subject<boolean>();

  public message: string;
  public score: number;
  public question: number;
  public totalScore: number;
  public needMorePractice: Set<string>;

  public status: LessonStatus;
  public LESSON_STATUS = LessonStatus;
  public language: string;
  public playingSong: boolean;
  videoUrl: SafeResourceUrl;

  private destroy$: Subject<void> = new Subject<void>();
  private lessonNotifySubscription!: Subscription;

  constructor(private lessonService: AlphabetService, private activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer) {
    this.thinkingTime = 2;
    this.score = 0;
    this.question = 0;
    this.totalScore = 0;
    this.message = '';
    this.needMorePractice = new Set();
    this.status = LessonStatus.ReadyToStart;
    this.language = '';
    this.playingSong = false;
    const url = 'https://www.youtube.com/embed/ezmsrB59mj8';
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.language = params['language'];
      this.playingSong = false;

      if (this.lessonNotifySubscription) {
        this.lessonNotifySubscription.unsubscribe();
      }

      if (this.language === 'vietnam') {
        this.lessonService.setQuestionList(VIETNAMESE_QUESTIONS);
        this.totalScore = VIETNAMESE_QUESTIONS.length;
      } else if (this.language === 'english') {
        this.lessonService.setQuestionList(ENGLISH_QUESTIONS);
        this.totalScore = ENGLISH_QUESTIONS.length;
      }

      this.lessonService.setAssetDir(this.language);
      this.lessonService.stop();
      this.status = LessonStatus.ReadyToStart;
      this.message = '';
      this.question = 0;
      this.score = 0;
    });
  }

  onTimesUp() {
    this.lessonService.nextQuestion();
  }

  onStart(event: MouseEvent) {
    this.playingSong = false;
    event.stopPropagation();
    this.score = 0;
    this.question = 0;
    this.needMorePractice.clear();
    this.lessonService.start();

    this.lessonNotifySubscription = this.lessonService.notify.pipe(
      tap((value: ILessonEmit) => {
        if (value.unit === END_SIGNAL) {
          this.message = '';
          this.status = LessonStatus.EndLesson;
        } else {
          this.status = LessonStatus.InProgress;
          this.message = value.format || '';
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
    this.playingSong = false;
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

  playAlphabetSong(event: MouseEvent) {
    event.stopPropagation();
    this.playingSong = true;
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
