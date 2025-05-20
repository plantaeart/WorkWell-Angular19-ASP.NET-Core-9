import { inject } from '@angular/core';
import { WorkWell } from '../models/workWell.model';
import { WorkWellStore } from '../store/workWell.store';
import { WorkWellSchedule } from '../models/workWellSchedule.model';
import e from 'express';
import { convertTimeStringToDate } from './string.utils';
import { WorkWellEvent } from '../models/workWellEvent.model';

export function workWellListMapping(): WorkWell[] {
  const workWellStore = inject(WorkWellStore);
  return [
    ...workWellStore.workWellList().map((workWell) => {
      return new WorkWell({
        ...workWell,
        workWellSchedule: workWell.workWellSchedule.map(
          (schedule) => new WorkWellSchedule(schedule)
        ),
      });
    }),
  ];
}

// A method that will that a list of WorkWell and set all start/endDateTemp with start/endDateDateFormat
export function setWorkWellEventTempDate(workWellEventList: WorkWellEvent[]) {
  workWellEventList.forEach((workWellEvent) => {
    workWellEvent.startDateTemp = new Date(workWellEvent.startDateDateFormat);
    workWellEvent.endDateTemp = new Date(workWellEvent.endDateDateFormat);
  });
}

export function areEventsEqual(
  arr1: WorkWellEvent[],
  arr2: WorkWellEvent[]
): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((event, i) => event.equals(arr2[i]));
}
