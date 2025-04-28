import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FlatpickrDirective,
  provideFlatpickrDefaults,
} from 'angularx-flatpickr';
import { CommonModule } from '@angular/common';
import { WorkWellEvent } from '../../../../models/workWellEvent.model';
import { WorkWellStore } from '../../../../store/workWell.store';
import { WorkWellEventType } from '../../../../../types/enums/workWellEventType';
import { convertTimeStringToDate } from '../../../../utils/string.utils';
import { WwShowScheduleInfosComponent } from '../ww-show-schedule-infos/ww-show-schedule-infos.component';

@Component({
  selector: 'ww-step-4',
  imports: [
    FormsModule,
    FlatpickrDirective,
    CommonModule,
    WwShowScheduleInfosComponent,
  ],
  providers: [
    provideFlatpickrDefaults({
      enableTime: true,
      noCalendar: true,
      dateFormat: 'H:i',
      time24hr: true,
    }),
  ],
  templateUrl: './ww-step-4.component.html',
  styleUrls: ['./ww-step-4.component.scss'],
})
export class WwStep4Component {
  @Output() pauseStateChange = new EventEmitter<{
    isCoherent: boolean;
    hasPauses: boolean;
  }>();

  public pauseErrors: string[][] = [];
  public pauseCoherencyOk = false;

  public workWellStore = inject(WorkWellStore);
  public workDay: WorkWellEvent =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].workDay;
  public lunch: WorkWellEvent =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].lunch;

  public meetings: WorkWellEvent[] =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings;

  // Create copies of the data
  public workDayCopy: WorkWellEvent = { ...this.workDay };
  public lunchCopy: WorkWellEvent = { ...this.lunch };
  public meetingsCopy: WorkWellEvent[] = this.meetings.map((meeting) => ({
    ...meeting,
  }));

  constructor() {
    // Convert startDate and endDate to Date for workDay if they are not already Date objects
    if (this.workDay.startDate.constructor.name !== 'Date') {
      this.workDay.startDate = convertTimeStringToDate(this.workDay.startDate);
    }

    if (this.workDay.endDate.constructor.name !== 'Date') {
      this.workDay.endDate = convertTimeStringToDate(this.workDay.endDate);
    }

    // Convert startDate and endDate to Date for lunch if they are not already Date objects
    if (this.lunch.startDate.constructor.name !== 'Date') {
      this.lunch.startDate = convertTimeStringToDate(this.lunch.startDate);
    }

    if (this.lunch.endDate.constructor.name !== 'Date') {
      this.lunch.endDate = convertTimeStringToDate(this.lunch.endDate);
    }

    // Check if meetings exists, if yes, make sure start/endDate are Date objects
    if (this.meetings && this.meetings.length > 0) {
      for (let i = 0; i < this.meetings.length; i++) {
        const meeting = this.meetings[i];
        if (meeting.startDate.constructor.name !== 'Date') {
          meeting.startDate = convertTimeStringToDate(meeting.startDate);
        }
        if (meeting.endDate.constructor.name !== 'Date') {
          meeting.endDate = convertTimeStringToDate(meeting.endDate);
        }
      }
    }

    // Check if pauses exists, if yes, make sure start/endDate are Date objects
    if (
      this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses &&
      this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses.length > 0
    ) {
      for (
        let i = 0;
        i <
        this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses.length;
        i++
      ) {
        const pause =
          this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses[i];
        if (pause.startDate.constructor.name !== 'Date') {
          pause.startDate = convertTimeStringToDate(pause.startDate);
        }
        if (pause.endDate.constructor.name !== 'Date') {
          pause.endDate = convertTimeStringToDate(pause.endDate);
        }
      }
    }

    this.verifyPauses(); // Initial verification of pauses
  }

  addNewPause(): void {
    this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses.push({
      startDate: this.workDay.startDate,
      endDate: this.workDay.endDate,
      eventType: WorkWellEventType.MEETING,
    });

    this.verifyPauses();
  }

  removePause(index: number): void {
    this.workWellStore
      .addNewWorkWell()
      .workWellSchedule[0].pauses.splice(index, 1);
    this.verifyPauses();
  }

  onPauseStartChange(index: number, newValue: Date): void {
    const pause =
      this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses[index];

    // Update startDate
    pause.startDate = newValue;

    // Ensure endDate is a Date object
    if (typeof pause.endDate === 'string') {
      pause.endDate = convertTimeStringToDate(pause.endDate);
    }

    this.verifyPauses();
  }

  onPauseEndChange(index: number, newValue: Date): void {
    const pause =
      this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses[index];

    // Update endDate
    pause.endDate = newValue;

    // Ensure startDate is a Date object
    if (typeof pause.startDate === 'string') {
      pause.startDate = convertTimeStringToDate(pause.startDate);
    }

    this.verifyPauses();
  }

  verifyPauses(): void {
    this.pauseErrors = [];
    this.pauseCoherencyOk = true;

    // Check if there are no pauses
    if (
      this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses ==
        undefined ||
      this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses.length ===
        0
    ) {
      this.pauseStateChange.emit({
        isCoherent: this.pauseCoherencyOk,
        hasPauses:
          this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses
            .length > 0,
      });
      return;
    }

    for (
      let i = 0;
      i < this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses.length;
      i++
    ) {
      const pause =
        this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses[i];
      const errors: string[] = [];

      // Check if startDate is earlier than endDate
      if (pause.startDate >= pause.endDate) {
        errors.push('⏰⬆️ Start time must be earlier than end time');
      }

      // Check if endDate is later than workDay endDate
      if (pause.endDate > this.workDay.endDate) {
        errors.push('⏰⬇️ End time must be earlier than work day end time');
      }

      // Check for overlap with lunch
      if (
        (pause.startDate >= this.lunch.startDate &&
          pause.startDate < this.lunch.endDate) ||
        (pause.endDate > this.lunch.startDate &&
          pause.endDate <= this.lunch.endDate) ||
        (pause.startDate <= this.lunch.startDate &&
          pause.endDate >= this.lunch.endDate)
      ) {
        errors.push('🍽️ Overlaps with lunch time');
      }

      // Check for overlap with meetings
      for (let j = 0; j < this.meetings.length; j++) {
        const meeting = this.meetings[j];
        if (
          (pause.startDate >= meeting.startDate &&
            pause.startDate < meeting.endDate) ||
          (pause.endDate > meeting.startDate &&
            pause.endDate <= meeting.endDate) ||
          (pause.startDate <= meeting.startDate &&
            pause.endDate >= meeting.endDate)
        ) {
          errors.push(`📅 Overlaps with meeting ${j + 1}`);
        }
      }

      // Check for overlap with other pauses
      for (
        let j = 0;
        j <
        this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses.length;
        j++
      ) {
        if (i !== j) {
          const otherPause =
            this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses[j];
          if (
            (pause.startDate >= otherPause.startDate &&
              pause.startDate < otherPause.endDate) ||
            (pause.endDate > otherPause.startDate &&
              pause.endDate <= otherPause.endDate) ||
            (pause.startDate <= otherPause.startDate &&
              pause.endDate >= otherPause.endDate)
          ) {
            errors.push(`⏸️ Overlaps with pause ${j + 1}`);
            break;
          }
        }
      }

      this.pauseErrors[i] = errors;
      if (errors.length > 0) {
        this.pauseCoherencyOk = false;
      }
    }

    this.pauseStateChange.emit({
      isCoherent: this.pauseCoherencyOk,
      hasPauses:
        this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses.length >
        0,
    });
  }
}
