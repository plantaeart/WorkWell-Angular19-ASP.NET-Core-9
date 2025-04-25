import { Component, OnInit, inject } from '@angular/core';
import { WorkWellStore } from '../../../../store/workWell.store';
import { WorkWell } from '../../../../models/workWell.model';
import { FormsModule } from '@angular/forms';
import {
  FlatpickrDirective,
  provideFlatpickrDefaults,
} from 'angularx-flatpickr';
import { convertTimeStringToDate } from '../../../../utils/string.utils';

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
  private initWorkDayAndLunch = false;
  public addNewWorkWell: WorkWell = this.workWellStore.addNewWorkWell();

  // Flatpickr preset configuration
  public workFlatpickrConfig = {
    enableTime: true,
    noCalendar: true,
    dateFormat: 'H:i',
    time24hr: true,
  };

  public lunchFlatpickrConfig = {
    ...this.workFlatpickrConfig,
  };

  constructor() {
    // Convert startDate and endDate to Date for workDay if they are not already Date objects
    if (
      !(
        this.addNewWorkWell.workWellSchedule[0].workDay.startDate instanceof
        Date
      )
    ) {
      this.addNewWorkWell.workWellSchedule[0].workDay.startDate =
        convertTimeStringToDate(
          this.addNewWorkWell.workWellSchedule[0].workDay.startDate
        );
    }

    if (
      !(this.addNewWorkWell.workWellSchedule[0].workDay.endDate instanceof Date)
    ) {
      this.addNewWorkWell.workWellSchedule[0].workDay.endDate =
        convertTimeStringToDate(
          this.addNewWorkWell.workWellSchedule[0].workDay.endDate
        );
    }

    // Convert startDate and endDate to Date for lunch if they are not already Date objects
    if (
      !(this.addNewWorkWell.workWellSchedule[0].lunch.startDate instanceof Date)
    ) {
      this.addNewWorkWell.workWellSchedule[0].lunch.startDate =
        convertTimeStringToDate(
          this.addNewWorkWell.workWellSchedule[0].lunch.startDate
        );
    }

    if (
      !(this.addNewWorkWell.workWellSchedule[0].lunch.endDate instanceof Date)
    ) {
      this.addNewWorkWell.workWellSchedule[0].lunch.endDate =
        convertTimeStringToDate(
          this.addNewWorkWell.workWellSchedule[0].lunch.endDate
        );
    }
  }

  onWorkDayStartChange(newValue: any): void {
    const workDayStart = newValue;
    const workDayEnd =
      this.addNewWorkWell.workWellSchedule?.[0]?.workDay.endDate;

    if (!workDayEnd) {
      console.error('Work day end date is not defined.');
      return;
    }

    // Ensure work day start is not after work day end
    if (workDayStart > workDayEnd) {
      this.addNewWorkWell.workWellSchedule[0].workDay.startDate = workDayEnd;
    } else {
      this.addNewWorkWell.workWellSchedule[0].workDay.startDate = workDayStart;
    }

    // Set lunch start date to work day start date if it's not already set
    if (
      !this.addNewWorkWell.workWellSchedule[0].lunch.startDate ||
      this.addNewWorkWell.workWellSchedule[0].lunch.startDate < workDayStart
    ) {
      this.addNewWorkWell.workWellSchedule[0].lunch.startDate = workDayStart;
    }
  }

  onWorkDayEndChange(newValue: any): void {
    const workDayEnd = newValue;
    const workDayStart =
      this.addNewWorkWell.workWellSchedule?.[0].workDay.startDate;

    if (!workDayStart) {
      console.error('Work day start date is not defined.');
      return;
    }

    // Ensure work day end is not before work day start
    if (workDayEnd < workDayStart) {
      this.addNewWorkWell.workWellSchedule[0].workDay.endDate = workDayStart;
    } else {
      this.addNewWorkWell.workWellSchedule[0].workDay.endDate = workDayEnd;
    }

    // Set lunch end date to work day end date if it's not already set or is invalid
    if (
      !this.addNewWorkWell.workWellSchedule[0].lunch.endDate ||
      this.addNewWorkWell.workWellSchedule[0].lunch.endDate > workDayEnd
    ) {
      this.addNewWorkWell.workWellSchedule[0].lunch.endDate = workDayEnd;
    }
  }

  onLunchStartChange(newValue: any): void {
    const lunchStart = newValue;
    const minDate = this.addNewWorkWell.workWellSchedule?.[0].workDay.startDate;
    const maxDate = this.addNewWorkWell.workWellSchedule?.[0].workDay?.endDate;

    if (!minDate || !maxDate) {
      console.error('Work day start or end date is not defined.');
      return;
    }

    // Validate the selected lunch start time
    if (lunchStart < minDate) {
      this.addNewWorkWell.workWellSchedule[0].lunch.startDate = minDate;
    } else if (lunchStart > maxDate) {
      this.addNewWorkWell.workWellSchedule[0].lunch.startDate = maxDate;
    } else {
      this.addNewWorkWell.workWellSchedule[0].lunch.startDate = lunchStart;
    }
  }

  onLunchEndChange(newValue: any): void {
    const lunchEnd = newValue;
    const minDate = this.addNewWorkWell.workWellSchedule?.[0].workDay.startDate;
    const maxDate = this.addNewWorkWell.workWellSchedule?.[0].workDay.endDate;

    if (!minDate || !maxDate) {
      console.error('Work day start or end date is not defined.');
      return;
    }

    // Validate the selected lunch end time
    if (lunchEnd < minDate) {
      this.addNewWorkWell.workWellSchedule[0].lunch.endDate = minDate;
    } else if (lunchEnd > maxDate) {
      this.addNewWorkWell.workWellSchedule[0].lunch.endDate = maxDate;
    } else {
      this.addNewWorkWell.workWellSchedule[0].lunch.startDate = lunchEnd;
    }
  }

  // Get the minimum date for lunch start
  getLunchMinDate(): string | Date {
    console.log(
      'getLunchMinDate : ',
      this.addNewWorkWell.workWellSchedule?.[0]?.workDay.startDate
    );
    return this.addNewWorkWell.workWellSchedule?.[0]?.workDay.startDate;
  }

  // Get the maximum date for lunch start and end
  getLunchMaxDate(): string | Date {
    return this.addNewWorkWell.workWellSchedule?.[0]?.workDay.endDate;
  }

  // Validate lunch times against work day times
  validateLunchTimes(): void {
    const workDayStart =
      this.addNewWorkWell.workWellSchedule[0].workDay.startDate;
    const workDayEnd = this.addNewWorkWell.workWellSchedule[0].workDay.endDate;
    const lunchStart = this.addNewWorkWell.workWellSchedule[0].lunch.startDate;
    const lunchEnd = this.addNewWorkWell.workWellSchedule[0].lunch.endDate;

    // Reset lunch start if it is before work day start or after work day end
    if (lunchStart < workDayStart || lunchStart > workDayEnd) {
      this.addNewWorkWell.workWellSchedule[0].lunch.startDate =
        this.addNewWorkWell.workWellSchedule[0].workDay.startDate;
    }

    // Reset lunch end if it is before work day start or after work day end
    if (lunchEnd < workDayStart || lunchEnd > workDayEnd) {
      this.addNewWorkWell.workWellSchedule[0].lunch.endDate =
        this.addNewWorkWell.workWellSchedule[0].workDay.endDate;
    }
  }
}
