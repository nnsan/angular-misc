import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ITick {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface IClockNumber {
  x: number;
  y: number;
  value: number;
}

@Component({
  selector: 'app-analog-clock',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './analog-clock.component.html',
  styleUrl: './analog-clock.component.scss'
})
export class AnalogClockComponent implements OnInit, OnChanges {
  @Input() hours: number;
  @Input() minutes: number;
  @Input() seconds: number;

  hourHandTransform: string;
  minuteHandTransform: string;
  secondHandTransform: string;
  ticks: ITick[];
  numbers: IClockNumber[];
  cx: number;
  cy: number;
  circleRadius: number;

  constructor() {
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;

    this.ticks = [];
    this.numbers = [];
    this.cx = 50;
    this.cy = 50;
    this.circleRadius = 48;

    this.hourHandTransform = '';
    this.minuteHandTransform = '';
    this.secondHandTransform = '';
  }

  ngOnInit() {
    this.generateTicks();
    this.generateNumbers();
  }

  generateTicks() {
    const radius = this.circleRadius;
    const smallTickLength = 3;
    for (let i = 0; i < 60; i++) {
      const angle = (i * 6) * (Math.PI / 180); // Convert degrees to radians
      const tick: ITick = {
        x1: this.cx + (radius * Math.cos(angle)),
        y1: this.cy + (radius * Math.sin(angle)),
        x2: this.cx + ((radius - smallTickLength) * Math.cos(angle)),
        y2: this.cy + ((radius - smallTickLength) * Math.sin(angle))
      };

      this.ticks.push(tick);
    }
  }

  generateNumbers() {
    const radius = this.circleRadius - 8;
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180); // Convert degrees to radians and adjust to place at 12 o'clock
      const number: IClockNumber = {
        x: this.cx + (radius * Math.cos(angle)),
        y: this.cy + (radius * Math.sin(angle)),
        value: i
      };

      this.numbers.push(number);
    }
  }

  updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    this.updateClockHands(hours, minutes, seconds);
  }

  updateClockHands(hours: number, minutes: number, seconds: number) {
    const hourDegrees = (hours + minutes / 60) * 30; // 360 / 12 = 30
    const minuteDegrees = (minutes + seconds / 60) * 6; // 360 / 60 = 6
    const secondDegrees = seconds * 6; // 360 / 60 = 6

    this.hourHandTransform = `rotate(${hourDegrees}, ${this.cx}, ${this.cy})`;
    this.minuteHandTransform = `rotate(${minuteDegrees}, ${this.cx}, ${this.cy})`;
    this.secondHandTransform = `rotate(${secondDegrees}, ${this.cx}, ${this.cy})`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('hours') && !changes['hours'].isFirstChange()) {
      this.hours = changes['hours'].currentValue;
    }

    if (changes.hasOwnProperty('minutes') && !changes['minutes'].isFirstChange()) {
      this.minutes = changes['minutes'].currentValue;
    }

    if (changes.hasOwnProperty('seconds') && !changes['seconds'].isFirstChange()) {
      this.seconds = changes['seconds'].currentValue;
    }

    this.updateClockHands(this.hours, this.minutes, this.seconds);
  }
}
