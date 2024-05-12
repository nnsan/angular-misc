import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Subject } from "rxjs";

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

@Component({
  selector: 'app-countdown-timer',
  standalone: true,
  imports: [],
  templateUrl: './countdown-timer.component.html',
  styleUrl: './countdown-timer.component.scss'
})
export class CountdownTimerComponent implements OnInit, OnDestroy {

  public timePassed = 0;
  public timeLeft = 0;
  public timerInterval: number | undefined;
  public remainingPathColor = COLOR_CODES.info.color;
  public timerLabel = '';
  public circleDasharray = '';

  @Input() timeLimit = 0;
  @Input() restartTimer!: Subject<boolean>;
  @Output() timesUp = new EventEmitter<boolean>();

  constructor() {
    this.timeLeft = this.timeLimit;
  }

  ngOnInit(): void {
    if (this.restartTimer) {
      this.restartTimer.subscribe((isTrigger) => {
        if (isTrigger) {
          this.timeLeft = this.timeLimit;
          this.timePassed = 0;
          this.remainingPathColor = COLOR_CODES.info.color;
          this.startTimer();
        }
      });
    }
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
    if (this.restartTimer) {
      this.restartTimer.unsubscribe();
    }
  }

  onTimesUp() {
    clearInterval(this.timerInterval);
    this.timesUp.emit(true);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timePassed = this.timePassed += 1;
      this.timeLeft = this.timeLimit - this.timePassed;
      this.timerLabel = this.formatTime(this.timeLeft);

      this.setCircleDasharray();
      this.setRemainingPathColor(this.timeLeft);

      if (this.timeLeft === 0) {
        this.onTimesUp();
      }
    }, 1000);
  }

  formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    let $seconds = `${seconds}`;

    if (seconds < 10) {
      $seconds = `0${seconds}`;
    }

    return `${minutes}:${$seconds}`;
  }

  setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
      this.remainingPathColor = alert.color;
    } else if (timeLeft <= warning.threshold) {
      this.remainingPathColor = warning.color;
    }
  }

  calculateTimeFraction() {
    const rawTimeFraction = this.timeLeft / this.timeLimit;
    return rawTimeFraction - (1 / this.timeLimit) * (1 - rawTimeFraction);
  }

  setCircleDasharray() {
    this.circleDasharray = `${(
      this.calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} ${FULL_DASH_ARRAY}`;
  }
}
