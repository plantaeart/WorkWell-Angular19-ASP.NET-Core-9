import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
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
import { pauseName } from '../../../../../types/enums/workWellEventName';
import { setWorkWellEventTempDate } from '../../../../utils/workWellUtils';

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
export class WwStep4Component implements OnInit {
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

  public pauses: WorkWellEvent[] =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses || [];

  // Create copies of the data
  public workDayCopy: WorkWellEvent = new WorkWellEvent({ ...this.workDay });
  public lunchCopy: WorkWellEvent = new WorkWellEvent({ ...this.lunch });
  public meetingsCopy: WorkWellEvent[] = this.meetings.map(
    (meeting) =>
      new WorkWellEvent({
        ...meeting,
      })
  );

  ngOnInit(): void {
    setWorkWellEventTempDate([
      this.workDay,
      this.lunch,
      ...this.meetings,
      ...this.pauses,
    ]); // Set temporary dates for meetings

    this.verifyPauses(); // Initial verification of pauses
  }

  addNewPause(): void {
    this.pauses.push(
      new WorkWellEvent({
        startDate: this.workDay.startDate,
        endDate: this.workDay.endDate,
        eventType: WorkWellEventType.PAUSE,
        name: pauseName + (this.pauses.length + 1),
      })
    );

    this.verifyPauses();
  }

  removePause(index: number): void {
    this.pauses.splice(index, 1);
    this.verifyPauses();
  }

  onPauseStartChange(index: number, newValue: Date): void {
    const pause = this.pauses[index];

    // Update startDate
    pause.setStartDateDateFormat(newValue);
    pause.startDateTemp = newValue;

    this.verifyPauses();
  }

  onPauseEndChange(index: number, newValue: Date): void {
    const pause = this.pauses[index];

    // Update endDate
    pause.setEndDateDateFormat(newValue);
    pause.endDateTemp = newValue;

    this.verifyPauses();
  }

  verifyPauses(): void {
    this.pauseErrors = [];
    this.pauseCoherencyOk = true;

    // Check if there are no pauses
    if (this.pauses == undefined || this.pauses.length === 0) {
      console.log('has pauses', this.pauses.length > 0);
      console.log('is coherent', this.pauseCoherencyOk);
      this.pauseStateChange.emit({
        isCoherent: this.pauseCoherencyOk,
        hasPauses: this.pauses.length > 0,
      });
      return;
    }

    for (let i = 0; i < this.pauses.length; i++) {
      const pause = this.pauses[i];
      const errors: string[] = [];

      // Check if startDate is earlier than endDate
      if (pause.startDateDateFormat >= pause.endDateDateFormat) {
        errors.push('⏰⬆️ Start time must be earlier than end time');
      }

      // Check if endDate is later than workDay endDate
      if (pause.endDateDateFormat > this.workDay.endDateDateFormat) {
        errors.push('⏰⬇️ End time must be earlier than work day end time');
      }

      // Check for overlap with lunch
      if (
        (pause.startDateDateFormat >= this.lunch.startDateDateFormat &&
          pause.startDateDateFormat < this.lunch.endDateDateFormat) ||
        (pause.endDateDateFormat > this.lunch.startDateDateFormat &&
          pause.endDateDateFormat <= this.lunch.endDateDateFormat) ||
        (pause.startDateDateFormat <= this.lunch.startDateDateFormat &&
          pause.endDateDateFormat >= this.lunch.endDateDateFormat)
      ) {
        errors.push('🍽️ Overlaps with lunch time');
      }

      // Check for overlap with meetings
      for (let j = 0; j < this.meetings.length; j++) {
        const meeting = this.meetings[j];
        if (
          (pause.startDateDateFormat >= meeting.startDateDateFormat &&
            pause.startDateDateFormat < meeting.endDateDateFormat) ||
          (pause.endDateDateFormat > meeting.startDateDateFormat &&
            pause.endDateDateFormat <= meeting.endDateDateFormat) ||
          (pause.startDateDateFormat <= meeting.startDateDateFormat &&
            pause.endDateDateFormat >= meeting.endDateDateFormat)
        ) {
          errors.push(`📅 Overlaps with meeting ${j + 1}`);
        }
      }

      // Check for overlap with other pauses
      for (let j = 0; j < this.pauses.length; j++) {
        if (i !== j) {
          const otherPause = this.pauses[j];
          if (
            (pause.startDateDateFormat >= otherPause.startDateDateFormat &&
              pause.startDateDateFormat < otherPause.endDateDateFormat) ||
            (pause.endDateDateFormat > otherPause.startDateDateFormat &&
              pause.endDateDateFormat <= otherPause.endDateDateFormat) ||
            (pause.startDateDateFormat <= otherPause.startDateDateFormat &&
              pause.endDateDateFormat >= otherPause.endDateDateFormat)
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

    console.log('has pauses', this.pauses.length > 0);
    console.log('is coherent', this.pauseCoherencyOk);
    this.pauseStateChange.emit({
      isCoherent: this.pauseCoherencyOk,
      hasPauses: this.pauses.length > 0,
    });
  }
}
