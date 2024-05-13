import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { getRandomInt, END_SIGNAL } from './utility';
import { takeUntil } from 'rxjs/operators';

interface ILessonService {
  notify: Observable<any>;
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  nextQuestion: () => void;
  setQuestionList: (list: ILessonQuestion[]) => void;
}

export interface ILessonQuestion {
  answer: string;
  lessonUnit: string;
  question: string;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService implements ILessonService {
  private nextQuestionTrigger = new Subject<void>();
  private questionList: ILessonQuestion[] = [];
  private stopNotifier$ = new Subject<void>();
  private isPaused: boolean;

  protected currentQuestion: ILessonQuestion | null;
  protected subject = new BehaviorSubject<string>('');
  protected remainItems: ILessonQuestion[] = [];

  public notify: Observable<string>;
  public assetsDir = './assets/vietnamese-letter/';

  constructor() {
    this.notify = this.subject.asObservable();
    this.currentQuestion = null;
    this.isPaused = false;
  }

  setQuestionList(questions: ILessonQuestion[]) {
    this.questionList = questions
  }

  protected questionDisplayFormat(lesson) {
    return lesson;
  }

  start() {
    this.stopNotifier$.next();
    this.remainItems = [...this.questionList];
    this.currentQuestion = null;
    this.isPaused = false;

    this.nextQuestionTrigger.pipe(takeUntil(this.stopNotifier$)).subscribe(async _ => {
      await this.buildQuestion();
    });
    this.nextQuestion();
  }

  stop() {
    this.stopNotifier$.next();
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
    this.nextQuestion();
  }

  nextQuestion() {
    this.nextQuestionTrigger.next();
  }

  private async buildQuestion() {
    if (this.isPaused) {
      return;
    }

    if (this.currentQuestion) {
      await this.readAnswer(this.currentQuestion);

      if (this.remainItems.length > 0) {
        this.generateQuestion();
      } else {
        this.sendEndSignal();

        this.stopNotifier$.next();
      }
    } else {
      this.generateQuestion();
    }
  }

  private readAnswer(item: ILessonQuestion): Promise<void> {
    return new Promise<void>((resolve) => {
      const answer = new Audio(`${this.assetsDir}${item.answer}`);
      answer.play().catch(err => {
        console.log(err);
      });

      setTimeout(_ => {
        resolve();
      }, 2_000);
    });
  }

  private readQuestion(): Promise<void> {
    return new Promise<void>((resolve) => {
      const question = new Audio(`${this.assetsDir}${this.currentQuestion?.question}`);
      question.play().catch(err => {
        console.log(err);
      });

      setTimeout(_ => {
        resolve();
      }, 2_000);
    });
  }

  private sendEndSignal() {
    this.subject.next(END_SIGNAL);
  }

  private async generateQuestion() {
    this.currentQuestion = this.getLetter();
    this.subject.next(this.questionDisplayFormat(this.currentQuestion.lessonUnit));
    await this.readQuestion();
  }

  private getLetter() {
    const position = getRandomInt(this.remainItems.length);
    const selectedItems = this.remainItems.splice(position, 1);
    return selectedItems[0];
  }
}
