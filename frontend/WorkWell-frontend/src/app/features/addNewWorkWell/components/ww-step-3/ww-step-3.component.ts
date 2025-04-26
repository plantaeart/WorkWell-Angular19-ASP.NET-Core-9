import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FlatpickrDirective,
  provideFlatpickrDefaults,
} from 'angularx-flatpickr';
import { CommonModule } from '@angular/common';
import { WorkWellStore } from '../../../../store/workWell.store';
import { WorkWellEvent } from '../../../../models/workWellEvent.model';
import { WorkWellEventType } from '../../../../../types/enums/workWellEventType';
import { convertTimeStringToDate } from '../../../../utils/string.utils';
import { WwShowScheduleInfosComponent } from '../ww-show-schedule-infos/ww-show-schedule-infos.component';

@Component({
  selector: 'ww-step-3',
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
  templateUrl: './ww-step-3.component.html',
  styleUrls: ['./ww-step-3.component.scss'],
})
export class WwStep3Component {
  @Output() meetingStateChange = new EventEmitter<{
    isCoherent: boolean;
    hasMeetings: boolean;
  }>();
  public workWellStore = inject(WorkWellStore);
  public workDay: WorkWellEvent =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].workDay;
  public lunch = this.workWellStore.addNewWorkWell().workWellSchedule[0].lunch;

  // Create copies of the data
  public workDayCopy = { ...this.workDay };
  public lunchCopy = { ...this.lunch };

  public flatpickrConfig = {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    time24hr: true,
    onChange: (selectedDates: Date[]) => {
      // Ensure Flatpickr returns Date objects
      return selectedDates[0];
    },
  };

  public meetingCoherencyOk = false;
  public meetingErrors: string[][] = [];

  constructor() {
    // Convert startDate and endDate to Date for workDay if they are not already Date objects
    if (this.workDay.startDate.constructor.name !== 'Date') {
      this.workDay.startDate = convertTimeStringToDate(this.workDay.startDate);
    }

    if (this.workDay.endDate.constructor.name !== 'Date') {
      this.workDay.endDate = convertTimeStringToDate(this.workDay.endDate);
    }

    // Convert startDate and endDate to Date for lunch if they are not already Date objects
    if (this.lunch.startDate instanceof String) {
      this.lunch.startDate = convertTimeStringToDate(this.lunch.startDate);
    }

    if (this.lunch.endDate instanceof String) {
      this.lunch.endDate = convertTimeStringToDate(this.lunch.endDate);
    }

    // Check is meetings exists, if yes, make sure start/endDate are Date objects
    if (
      this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings &&
      this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings.length >
        0
    ) {
      for (
        let i = 0;
        i <
        this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings.length;
        i++
      ) {
        const meeting =
          this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings[i];
        if (meeting.startDate.constructor.name !== 'Date') {
          meeting.startDate = convertTimeStringToDate(meeting.startDate);
        }
        if (meeting.endDate.constructor.name !== 'Date') {
          meeting.endDate = convertTimeStringToDate(meeting.endDate);
        }
      }
    }
    this.verifyMeetings(); // Initial verification of meetings
  }

  addNewMeeting(): void {
    this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings.push({
      startDate: this.workDay.startDate,
      endDate: this.workDay.endDate,
      eventType: WorkWellEventType.MEETING,
    });
    this.verifyMeetings();
  }

  removeMeeting(index: number): void {
    this.workWellStore
      .addNewWorkWell()
      .workWellSchedule[0].meetings.splice(index, 1);
    this.verifyMeetings(); // Re-verify after removing a meeting
  }

  onMeetingStartChange(index: number, newValue: Date): void {
    const meeting =
      this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings[index];

    // Update startDate
    meeting.startDate = newValue;

    // Ensure endDate is a Date object
    if (typeof meeting.endDate === 'string') {
      meeting.endDate = convertTimeStringToDate(meeting.endDate);
    }

    this.verifyMeetings(); // Re-verify after changing start time
  }

  onMeetingEndChange(index: number, newValue: Date): void {
    const meeting =
      this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings[index];

    // Update endDate
    meeting.endDate = newValue;

    // Ensure startDate is a Date object
    if (typeof meeting.startDate === 'string') {
      meeting.startDate = convertTimeStringToDate(meeting.startDate);
    }

    this.verifyMeetings(); // Re-verify after changing end time
  }

  verifyMeetings(): void {
    this.meetingErrors = [];
    this.meetingCoherencyOk = true;

    // Check if there are no meetings
    if (
      this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings ==
        undefined ||
      this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings
        .length === 0
    )
      return;

    for (
      let i = 0;
      i <
      this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings.length;
      i++
    ) {
      const meeting =
        this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings[i];
      const errors: string[] = [];

      // Check if startDate is earlier than endDate
      if (meeting.startDate >= meeting.endDate) {
        errors.push('⏰⬆️ Start time must be earlier than end time');
      }

      // Check is endDate is later than workDay endDate
      if (meeting.endDate > this.workDay.endDate) {
        errors.push('⏰⬇️ End time must be earlier than work day end time');
      }

      // Check for overlap with other meetings
      for (
        let j = 0;
        j <
        this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings.length;
        j++
      ) {
        if (i !== j) {
          const otherMeeting =
            this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings[j];

          if (
            (meeting.startDate >= otherMeeting.startDate &&
              meeting.startDate < otherMeeting.endDate) ||
            (meeting.endDate > otherMeeting.startDate &&
              meeting.endDate <= otherMeeting.endDate) ||
            (meeting.startDate <= otherMeeting.startDate &&
              meeting.endDate >= otherMeeting.endDate)
          ) {
            errors.push('📅 Overlaps with meeting ' + (j + 1));
            break;
          }
        }
      }

      // Check for overlap with lunch
      if (
        (meeting.startDate >= this.lunch.startDate &&
          meeting.startDate < this.lunch.endDate) ||
        (meeting.endDate > this.lunch.startDate &&
          meeting.endDate <= this.lunch.endDate) ||
        (meeting.startDate <= this.lunch.startDate &&
          meeting.endDate >= this.lunch.endDate)
      ) {
        errors.push('🍽️ Overlaps with lunch time');
      }

      // Add errors or mark as valid
      this.meetingErrors[i] = errors;
      if (errors.length > 0) {
        this.meetingCoherencyOk = false;
      }
    }

    this.meetingStateChange.emit({
      isCoherent: this.meetingCoherencyOk,
      hasMeetings:
        this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings
          .length > 0,
    });
  }
}
