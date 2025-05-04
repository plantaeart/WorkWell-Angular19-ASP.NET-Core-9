import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkWellEventType } from '../../../types/enums/workWellEventType';
import { WorkWellEvent } from '../../models/workWellEvent.model';
import {
  endDayName,
  startDayName,
  workDayName,
  workHoursName,
} from '../../../types/enums/workWellEventName';
import e from 'express';
import { WorkWell } from '../../models/workWell.model';
import { convertWorkWellTimeToDate } from '../../utils/workWellUtils';

@Component({
  selector: 'ww-timeline',
  imports: [CommonModule],
  templateUrl: './ww-timeline.component.html',
  styleUrl: './ww-timeline.component.scss',
})
export class WwTimelineComponent implements OnInit, OnDestroy {
  @Input() events: WorkWellEvent[] = [];
  @Input() workDay!: WorkWellEvent; // Default to empty workDay
  @Input() isHorizontal = false; // Default to vertical timeline
  @Input() isShowCurrentTime = true; // Default to show current time

  currentTime: Date = new Date(); // Property to hold the current time
  private clockTimeout: any; // To store the timeout reference
  private clockInterval: any; // To store the interval reference
  public startDayName = startDayName; // Expose startDayName for use in the template
  public endDayName = endDayName; // Expose endDayName for use in the template

  public workDayStart!: WorkWellEvent;
  public workDayEnd!: WorkWellEvent;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workDay'] && this.workDay) {
      // Initialize workDayStart and workDayEnd based on the input workDay
      this.workDayStart = new WorkWellEvent({
        startDate: this.workDay.startDate,
        name: startDayName,
        eventType: WorkWellEventType.WORKDAY,
      });

      this.workDayEnd = new WorkWellEvent({
        endDate: this.workDay.endDate,
        name: endDayName,
        eventType: WorkWellEventType.WORKDAY,
      });
      // Convert workDay times to Date objects
      convertWorkWellTimeToDate({
        anything: [this.workDayStart, this.workDayEnd],
      });
    }
  }

  ngOnInit() {
    if (this.isShowCurrentTime) {
      // Start an interval to update the time every milisecond
      this.clockInterval = setInterval(() => {
        this.updateTime();
      }, 1000); // Update every second
    }
  }

  ngOnDestroy() {
    if (this.isShowCurrentTime) {
      // Clear the timeout and interval when the component is destroyed
      if (this.clockTimeout) {
        clearTimeout(this.clockTimeout);
      }
      if (this.clockInterval) {
        clearInterval(this.clockInterval);
      }
    }
  }

  private updateTime = () => {
    this.currentTime = new Date();
  };

  public isCurrentTimeInEvent(event: WorkWellEvent): boolean {
    const now = this.currentTime.getTime();

    // Check if the current time is within 1 hour before the workday starts
    if (this.workDayStart) {
      const oneHourBeforeStart = new Date(
        (this.workDayStart.startDate as Date).getTime() - 60 * 60 * 1000
      );
      if (
        now >= oneHourBeforeStart.getTime() &&
        now < (this.workDayStart.startDate as Date).getTime()
      ) {
        return event === this.workDayStart; // Highlight workDayStart only before the day starts
      }
    }

    // Ensure workDayStart is not highlighted after the day starts
    if (
      event === this.workDayStart &&
      now >= (this.workDayStart.startDate as Date).getTime()
    ) {
      return false;
    }

    // Ensure workDayEnd is not highlighted before the day ends
    if (
      event === this.workDayEnd &&
      now < (this.workDayEnd.endDate as Date).getTime()
    ) {
      return false;
    }

    // Check if the current time is after the workday ends
    if (this.workDayEnd && now > (this.workDayEnd.endDate as Date).getTime()) {
      return event === this.workDayEnd; // Highlight workDayEnd
    }

    // Check if the current time is within the event's time range
    return (
      now >= (event.startDate as Date).getTime() &&
      now <= (event.endDate as Date).getTime()
    );
  }

  get filledEvents() {
    if (!this.workDay) {
      return this.sortedEvents; // If no workDay is provided, return sorted events as is
    }

    const filledEvents = [];
    let currentTime = this.workDay.startDate as Date; // Start from the workday start time

    // Sort events by start time
    const sorted = this.sortedEvents;

    // Fill gaps with empty events
    for (const event of sorted) {
      if (currentTime < event.startDate) {
        filledEvents.push({
          startDate: currentTime,
          endDate: event.startDate,
          name: workDayName,
          eventType: WorkWellEventType.NONE, // Custom type for empty events
        });
      }
      filledEvents.push(event);
      currentTime = event.endDate as Date;
    }

    // Add an empty event for the time after the last event until the end of the workday
    if (currentTime < this.workDay.endDate) {
      filledEvents.push({
        startDate: currentTime,
        endDate: this.workDay.endDate as Date,
        name: workDayName,
        eventType: WorkWellEventType.NONE,
      });
    }

    return filledEvents;
  }

  get sortedEvents() {
    return this.events.sort(
      (a, b) =>
        (a.startDate as Date).getTime() - (b.startDate as Date).getTime()
    );
  }

  public getEventClass(eventType: WorkWellEventType): string {
    switch (eventType) {
      case WorkWellEventType.WORKDAY:
        return 'bg-blue-500';
      case WorkWellEventType.LUNCH:
        return 'bg-green-500';
      case WorkWellEventType.MEETING:
        return 'bg-yellow-500';
      case WorkWellEventType.PAUSE:
        return 'bg-fuchsia-500';
      case WorkWellEventType.NONE:
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  }

  public getIsHorizontal(): string {
    return this.isHorizontal ? 'flex-row' : 'flex-col';
  }

  public getCurrentAndNextEvents() {
    const now = this.currentTime.getTime();

    // Sort events by start time
    const filledEvents = this.filledEvents;

    let currentEvent: WorkWellEvent | null = null;
    let nextEvent: WorkWellEvent | null = null;

    // Check if we are within 1 hour before the workday starts
    if (this.workDayStart) {
      const oneHourBeforeStart = new Date(
        (this.workDayStart.startDate as Date).getTime() - 60 * 60 * 1000
      );
      if (
        now >= oneHourBeforeStart.getTime() &&
        now < (this.workDayStart.startDate as Date).getTime()
      ) {
        return {
          currentEvent: this.workDayStart,
          nextEvent: filledEvents[0] || null,
        };
      }
    }

    // Check if we are after the workday ends
    if (this.workDayEnd && now > (this.workDayEnd.endDate as Date).getTime()) {
      return { currentEvent: this.workDayEnd, nextEvent: null };
    }

    // Loop through events to find the current and next events
    for (let i = 0; i < filledEvents.length; i++) {
      const event = filledEvents[i];
      if (
        now >= (event.startDate as Date).getTime() &&
        now <= (event.endDate as Date).getTime()
      ) {
        currentEvent = event;
        nextEvent = filledEvents[i + 1] || null; // Get the next event if it exists
        break;
      } else if (now < (event.startDate as Date).getTime()) {
        nextEvent = event;
        break;
      }
    }

    // If no current event is found and the current time is before the first event, set currentEvent to Start Day
    if (!currentEvent && this.workDay) {
      currentEvent = {
        startDate: this.workDay.startDate as Date,
        endDate: this.workDay.startDate as Date,
        name: startDayName,
        eventType: WorkWellEventType.WORKDAY,
      };
    }

    return { currentEvent, nextEvent };
  }

  public getTimeBetweenEvents(
    nextEvent: { startDate: string | Date | undefined } | null
  ): string {
    if (!nextEvent) {
      return 'N/A';
    }

    const timeDiff =
      (nextEvent.startDate as Date).getTime() - this.currentTime.getTime(); // Corrected logic
    if (timeDiff < 0) {
      return '0 min 0 sec'; // If the next event has already started
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours} hour ${minutes} min ${seconds} sec`;
  }
}
