export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export enum LessonStatus {
  InProgress,
  EndLesson,
  ReadyToStart
}

export const END_SIGNAL = 'End Of Lesson';
