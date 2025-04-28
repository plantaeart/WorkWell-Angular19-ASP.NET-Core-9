import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDateToHHmm } from '../../../../utils/string.utils';
import { WorkWellEvent } from '../../../../models/workWellEvent.model';

@Component({
  selector: 'ww-show-schedule-infos',
  imports: [CommonModule],
  templateUrl: './ww-show-schedule-infos.component.html',
  styleUrls: ['./ww-show-schedule-infos.component.scss'],
})
export class WwShowScheduleInfosComponent implements OnChanges {
  @Input() workDay: WorkWellEvent | null = null;
  @Input() lunch: WorkWellEvent | null = null;
  @Input() meetings: WorkWellEvent[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    // Transform workDay dates
    if (this.workDay && this.workDay.startDate && this.workDay.endDate) {
      if (this.workDay.startDate.constructor.name == 'Date') {
        this.workDay.startDate = formatDateToHHmm(
          this.workDay.startDate as Date
        );
      }
      if (this.workDay.endDate.constructor.name == 'Date') {
        this.workDay.endDate = formatDateToHHmm(this.workDay.endDate as Date);
      }
    }

    // Transform lunch dates
    if (this.lunch && this.lunch.startDate && this.lunch.endDate) {
      if (this.lunch.startDate.constructor.name == 'Date') {
        this.lunch.startDate = formatDateToHHmm(this.lunch.startDate as Date);
      }
      if (this.lunch.endDate.constructor.name == 'Date') {
        this.lunch.endDate = formatDateToHHmm(this.lunch.endDate as Date);
      }
    }

    // Transform meetings dates
    if (this.meetings && this.meetings.length > 0) {
      this.meetings.forEach((meeting) => {
        if (meeting && meeting.startDate && meeting.endDate) {
          if (meeting.startDate.constructor.name == 'Date') {
            meeting.startDate = formatDateToHHmm(meeting.startDate as Date);
          }
          if (meeting.endDate.constructor.name == 'Date') {
            meeting.endDate = formatDateToHHmm(meeting.endDate as Date);
          }
        }
      });
    }
  }
}
