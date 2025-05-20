import { Component, EventEmitter, inject, Output } from '@angular/core';
import { WorkWellStore } from '../../../../store/workWell.store';
import { FormsModule } from '@angular/forms';
import {
  FlatpickrDirective,
  provideFlatpickrDefaults,
} from 'angularx-flatpickr';
import { WorkWellEvent } from '../../../../models/workWellEvent.model';
import {
  lunchName,
  workHoursName,
} from '../../../../../types/enums/workWellEventName';
import { CommonModule } from '@angular/common';
import { setWorkWellEventTempDate } from '../../../../utils/workWellUtils';

@Component({
  selector: 'ww-step-2',
  imports: [FormsModule, FlatpickrDirective, CommonModule],
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
  @Output() lunchStateChange = new EventEmitter<{ isCoherent: boolean }>();
  @Output() WorkDayStateChange = new EventEmitter<{ isCoherent: boolean }>();

  private workWellStore = inject(WorkWellStore);
  public workDay: WorkWellEvent =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].workDay;
  public lunch: WorkWellEvent =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].lunch;

  public lunchErrors: string[] = []; // Store lunch validation errors
  public lunchCoherencyOk = true; // Track if lunch times are coherent
  public workDayErrors: string[] = []; // Store workday validation errors
  public workDayCoherencyOk = true; // Track if workday times are coherent

  constructor() {
    this.workDay.name = workHoursName;
    this.lunch.name = lunchName;
    setWorkWellEventTempDate([this.workDay, this.lunch]); // Set temporary dates for meetings

    this.verifyLunch(); // Initial verification of lunch times
  }

  onWorkDayStartChange(newValue: Date): void {
    this.workDay.setStartDateDateFormat(newValue);
    this.workDay.startDateTemp = newValue;
    this.verifyLunch(); // Verify lunch after workday start change
  }

  onWorkDayEndChange(newValue: Date): void {
    this.workDay.setEndDateDateFormat(newValue);
    this.workDay.endDateTemp = newValue;
    this.verifyLunch(); // Verify lunch after workday end change
  }

  onLunchStartChange(newValue: Date): void {
    this.lunch.setStartDateDateFormat(newValue);
    this.lunch.startDateTemp = newValue;
    this.verifyLunch(); // Verify lunch after lunch start change
  }

  onLunchEndChange(newValue: Date): void {
    this.lunch.setEndDateDateFormat(newValue);
    this.lunch.endDateTemp = newValue;
    this.verifyLunch(); // Verify lunch after lunch end change
  }

  verifyWorkDay(): void {
    this.workDayErrors = []; // Reset errors
    this.workDayCoherencyOk = true; // Assume lunch is coherent initially

    // Check if workDay start time is equal to workDay end time
    if (
      this.workDay.startDateDateFormat.getTime() ===
      this.workDay.endDateDateFormat.getTime()
    ) {
      this.workDayErrors.push(
        '🍽️ Lunch start time cannot be the same as lunch end time'
      );
      this.workDayCoherencyOk = false;
    }

    // Emit the lunch coherency state
    this.lunchStateChange.emit({ isCoherent: this.workDayCoherencyOk });
  }

  verifyLunch(): void {
    this.lunchErrors = []; // Reset errors
    this.lunchCoherencyOk = true; // Assume lunch is coherent initially

    // Check if lunch start is within workday bounds
    if (this.lunch.startDateDateFormat < this.workDay.startDateDateFormat) {
      this.lunchErrors.push(
        '🍽️ Lunch start time must be after workday start time'
      );
      this.lunchCoherencyOk = false;
    }
    if (this.lunch.startDateDateFormat >= this.workDay.endDateDateFormat) {
      this.lunchErrors.push(
        '🍽️ Lunch start time must be before workday end time'
      );
      this.lunchCoherencyOk = false;
    }

    // Check if lunch end is within workday bounds
    if (this.lunch.endDateDateFormat <= this.workDay.startDateDateFormat) {
      this.lunchErrors.push(
        '🍽️ Lunch end time must be after workday start time'
      );
      this.lunchCoherencyOk = false;
    }
    if (this.lunch.endDateDateFormat > this.workDay.endDateDateFormat) {
      this.lunchErrors.push(
        '🍽️ Lunch end time must be before workday end time'
      );
      this.lunchCoherencyOk = false;
    }

    // Check if lunch start time is equal to lunch end time
    if (
      this.lunch.startDateDateFormat.getTime() ===
      this.lunch.endDateDateFormat.getTime()
    ) {
      this.lunchErrors.push(
        '🍽️ Lunch start time cannot be the same as lunch end time'
      );
      this.lunchCoherencyOk = false;
    }

    // Emit the lunch coherency state
    this.lunchStateChange.emit({ isCoherent: this.lunchCoherencyOk });
  }
}
