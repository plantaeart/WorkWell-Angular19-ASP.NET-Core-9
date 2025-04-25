import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatDateToHHmm } from '../../../../utils/string.utils';

@Component({
  selector: 'ww-show-schedule-infos',
  imports: [CommonModule],
  templateUrl: './ww-show-schedule-infos.component.html',
  styleUrls: ['./ww-show-schedule-infos.component.scss'],
})
export class WwShowScheduleInfosComponent implements OnChanges {
  @Input() workDay: {
    startDate?: string | Date;
    endDate?: string | Date;
  } | null = null;
  @Input() lunch: {
    startDate?: string | Date;
    endDate?: string | Date;
  } | null = null;
  @Input() meetings: { startDate?: string | Date; endDate?: string | Date }[] =
    [];

  ngOnChanges(changes: SimpleChanges): void {
    // Transform workDay dates
    if (this.workDay) {
      if (this.workDay.startDate instanceof Date) {
        this.workDay.startDate = formatDateToHHmm(this.workDay.startDate);
      }
      if (this.workDay.endDate instanceof Date) {
        this.workDay.endDate = formatDateToHHmm(this.workDay.endDate);
      }
    }

    // Transform lunch dates
    if (this.lunch) {
      if (this.lunch.startDate instanceof Date) {
        this.lunch.startDate = formatDateToHHmm(this.lunch.startDate);
      }
      if (this.lunch.endDate instanceof Date) {
        this.lunch.endDate = formatDateToHHmm(this.lunch.endDate);
      }
    }

    // Transform meetings dates
    if (this.meetings && this.meetings.length > 0) {
      this.meetings.forEach((meeting) => {
        if (meeting.startDate instanceof Date) {
          meeting.startDate = formatDateToHHmm(meeting.startDate);
        }
        if (meeting.endDate instanceof Date) {
          meeting.endDate = formatDateToHHmm(meeting.endDate);
        }
      });
    }
  }
}
