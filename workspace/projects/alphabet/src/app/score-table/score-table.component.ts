import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

export interface IScoreTable {
  score: number;
  question: number;
  total: number;
}

@Component({
  selector: 'app-score-table',
  standalone: true,
  imports: [
    MatTableModule
  ],
  templateUrl: './score-table.component.html',
  styleUrl: './score-table.component.scss'
})
export class ScoreTableComponent implements OnInit, OnChanges {
  displayedColumns: string[] = ['score', 'question', 'total'];
  dataSource = new MatTableDataSource<IScoreTable>();

  @Input() score: number;
  @Input() total: number;
  @Input() question: number;

  constructor() {
    this.score = 0;
    this.total = 0;
    this.question = 0;
  }

  ngOnInit(): void {
    this.dataSource.data = [{score: this.score, question: this.question, total: this.total}];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('score') && !changes['score'].isFirstChange()) {
      this.score = changes['score'].currentValue;
    }

    if (changes.hasOwnProperty('question') && !changes['question'].isFirstChange()) {
      this.question = changes['question'].currentValue;
    }

    this.dataSource.data = [{score: this.score, question: this.question, total: this.total}];
  }
}
