import { Component, OnInit, inject } from '@angular/core';
import { WorkWellStore } from '../../../../store/workWell.store';
import { WorkWell } from '../../../../models/workWell.model';
import { FormsModule } from '@angular/forms';
import {
  FlatpickrDirective,
  provideFlatpickrDefaults,
} from 'angularx-flatpickr';
import { convertTimeStringToDate } from '../../../../utils/string.utils';
import { WorkWellEvent } from '../../../../models/workWellEvent.model';
import { convertWorkWellTimeToDate } from '../../../../utils/workWellUtils';
import {
  lunchName,
  workDayName,
  workHoursName,
} from '../../../../../types/enums/workWellEventName';

@Component({
  selector: 'ww-step-2',
  imports: [FormsModule, FlatpickrDirective],
  providers: [
    provideFlatpickrDefaults({
      enableTime: true,
      noCalendar: true,
      dateFormat: 'H:i',
      time24hr: true,
    }),
  ],
  templateUrl: './ww-step-2.component.html',
  styleUrls: ['./ww-step-2.component.scss'],
})
export class WwStep2Component {
  private workWellStore = inject(WorkWellStore);
  public workDay: WorkWellEvent =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].workDay;
  public lunch: WorkWellEvent =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].lunch;

  constructor() {
    convertWorkWellTimeToDate({ workDay: this.workDay, lunch: this.lunch });
    this.workDay.name = workHoursName;
    this.lunch.name = lunchName;
  }

  onWorkDayStartChange(newValue: Date): void {
    this.workDay.startDate = newValue;
  }

  onWorkDayEndChange(newValue: Date): void {
    this.workDay.endDate = newValue;
  }

  onLunchStartChange(newValue: Date): void {
    this.lunch.startDate = newValue;
  }

  onLunchEndChange(newValue: Date): void {
    this.lunch.endDate = newValue;
  }
}
