import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FlatpickrDirective,
  provideFlatpickrDefaults,
} from 'angularx-flatpickr';
import { CommonModule } from '@angular/common';
import { WorkWellStore } from '../../../../store/workWell.store';
import { WorkWellEvent } from '../../../../models/workWellEvent.model';
import { WorkWellEventType } from '../../../../../types/enums/workWellEventType';
import { WwShowScheduleInfosComponent } from '../ww-show-schedule-infos/ww-show-schedule-infos.component';
import { meetingName } from '../../../../../types/enums/workWellEventName';
import { setWorkWellEventTempDate } from '../../../../utils/workWellUtils';

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
  }>();
  public workWellStore = inject(WorkWellStore);
  public workDay: WorkWellEvent =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].workDay;
  public lunch = this.workWellStore.addNewWorkWell().workWellSchedule[0].lunch;
  public meetings: WorkWellEvent[] =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings || [];

  // Create copies of the data
  public workDayCopy: WorkWellEvent = new WorkWellEvent({ ...this.workDay });
  public lunchCopy: WorkWellEvent = new WorkWellEvent({ ...this.lunch });

  public meetingCoherencyOk = false;
  public meetingErrors: string[][] = [];

  constructor() {
    setWorkWellEventTempDate([this.workDay, this.lunch, ...this.meetings]); // Set temporary dates for meetings
    this.verifyMeetings(); // Initial verification of meetings
  }

  addNewMeeting(): void {
    this.meetings.push(
      new WorkWellEvent({
        startDate: this.workDay.startDate,
        endDate: this.workDay.endDate,
        eventType: WorkWellEventType.MEETING,
        name: meetingName + (this.meetings.length + 1),
      })
    );
    this.verifyMeetings();
  }

  removeMeeting(index: number): void {
    this.meetings.splice(index, 1);
    this.verifyMeetings(); // Re-verify after removing a meeting
  }

  onMeetingStartChange(index: number, newValue: Date): void {
    // Update startDate
    this.meetings[index].setStartDateDateFormat(newValue);
    this.meetings[index].startDateTemp = newValue;
    this.verifyMeetings(); // Re-verify after changing start time
  }

  onMeetingEndChange(index: number, newValue: Date): void {
    // Update endDate
    this.meetings[index].setEndDateDateFormat(newValue);
    this.meetings[index].endDateTemp = newValue;
    this.verifyMeetings(); // Re-verify after changing end time
  }

  verifyMeetings(): void {
    this.meetingErrors = [];
    this.meetingCoherencyOk = true;

    // Check if there are no meetings
    if (this.meetings == undefined || this.meetings.length === 0) {
      this.meetingStateChange.emit({
        isCoherent: this.meetingCoherencyOk,
      });
      return;
    }

    for (let i = 0; i < this.meetings.length; i++) {
      const meeting = this.meetings[i];
      const errors: string[] = [];

      // Check if startDate is earlier than endDate
      if (meeting.startDateDateFormat >= meeting.endDateDateFormat) {
        errors.push('⏰⬆️ Start time must be earlier than end time');
      }

      // Check is endDate is later than workDay endDate
      if (meeting.endDateDateFormat > this.workDay.endDateDateFormat) {
        errors.push('⏰⬇️ End time must be earlier than work day end time');
      }

      // Check for overlap with other meetings
      for (let j = 0; j < this.meetings.length; j++) {
        if (i !== j) {
          const otherMeeting = this.meetings[j];

          if (
            (meeting.startDateDateFormat >= otherMeeting.startDateDateFormat &&
              meeting.startDateDateFormat < otherMeeting.endDateDateFormat) ||
            (meeting.endDateDateFormat > otherMeeting.startDateDateFormat &&
              meeting.endDateDateFormat <= otherMeeting.endDateDateFormat) ||
            (meeting.startDateDateFormat <= otherMeeting.startDateDateFormat &&
              meeting.endDateDateFormat >= otherMeeting.endDateDateFormat)
          ) {
            errors.push('📅 Overlaps with meeting ' + (j + 1));
            break;
          }
        }
      }

      // Check for overlap with lunch
      if (
        (meeting.startDateDateFormat >= this.lunch.startDateDateFormat &&
          meeting.startDateDateFormat < this.lunch.endDateDateFormat) ||
        (meeting.endDateDateFormat > this.lunch.startDateDateFormat &&
          meeting.endDateDateFormat <= this.lunch.endDateDateFormat) ||
        (meeting.startDateDateFormat <= this.lunch.startDateDateFormat &&
          meeting.endDateDateFormat >= this.lunch.endDateDateFormat)
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
    });
  }
}
