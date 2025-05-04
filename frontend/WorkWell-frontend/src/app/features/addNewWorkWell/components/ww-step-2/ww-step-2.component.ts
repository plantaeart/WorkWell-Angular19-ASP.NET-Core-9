import { Component, EventEmitter, inject, Output } from '@angular/core';
import { WorkWellStore } from '../../../../store/workWell.store';
import { FormsModule } from '@angular/forms';
import {
  FlatpickrDirective,
  provideFlatpickrDefaults,
} from 'angularx-flatpickr';
import { WorkWellEvent } from '../../../../models/workWellEvent.model';
import { convertWorkWellTimeToDate } from '../../../../utils/workWellUtils';
import {
  lunchName,
  workHoursName,
} from '../../../../../types/enums/workWellEventName';
import { CommonModule } from '@angular/common';

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

  private workWellStore = inject(WorkWellStore);
  public workDay: WorkWellEvent =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].workDay;
  public lunch: WorkWellEvent =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].lunch;

  public lunchErrors: string[] = []; // Store lunch validation errors
  public lunchCoherencyOk = true; // Track if lunch times are coherent

  constructor() {
    convertWorkWellTimeToDate({ workDay: this.workDay, lunch: this.lunch });
    this.workDay.name = workHoursName;
    this.lunch.name = lunchName;

    this.verifyLunch(); // Initial verification of lunch times
  }

  onWorkDayStartChange(newValue: Date): void {
    this.workDay.startDate = newValue;
    this.verifyLunch(); // Verify lunch after workday start change
  }

  onWorkDayEndChange(newValue: Date): void {
    this.workDay.endDate = newValue;
    this.verifyLunch(); // Verify lunch after workday end change
  }

  onLunchStartChange(newValue: Date): void {
    this.lunch.startDate = newValue;
    this.verifyLunch(); // Verify lunch after lunch start change
  }

  onLunchEndChange(newValue: Date): void {
    this.lunch.endDate = newValue;
    this.verifyLunch(); // Verify lunch after lunch end change
  }

  verifyLunch(): void {
    this.lunchErrors = []; // Reset errors
    this.lunchCoherencyOk = true; // Assume lunch is coherent initially

    // Check if lunch start is within workday bounds
    if (this.lunch.startDate < this.workDay.startDate) {
      this.lunchErrors.push(
        '🍽️ Lunch start time must be after workday start time'
      );
      this.lunchCoherencyOk = false;
    }
    if (this.lunch.startDate >= this.workDay.endDate) {
      this.lunchErrors.push(
        '🍽️ Lunch start time must be before workday end time'
      );
      this.lunchCoherencyOk = false;
    }

    // Check if lunch end is within workday bounds
    if (this.lunch.endDate <= this.workDay.startDate) {
      this.lunchErrors.push(
        '🍽️ Lunch end time must be after workday start time'
      );
      this.lunchCoherencyOk = false;
    }
    if (this.lunch.endDate > this.workDay.endDate) {
      this.lunchErrors.push(
        '🍽️ Lunch end time must be before workday end time'
      );
      this.lunchCoherencyOk = false;
    }

    // Check if lunch start time is equal to lunch end time
    if (
      (this.lunch.startDate as Date).getTime() ===
      (this.lunch.endDate as Date).getTime()
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
