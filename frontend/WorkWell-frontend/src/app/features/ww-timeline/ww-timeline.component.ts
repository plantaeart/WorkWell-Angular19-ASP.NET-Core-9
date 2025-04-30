import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkWellEventType } from '../../../types/enums/workWellEventType';
import { WorkWellEvent } from '../../models/workWellEvent.model';
import {
  endDayName,
  startDayName,
  workDayName,
} from '../../../types/enums/workWellEventName';

@Component({
  selector: 'ww-timeline',
  imports: [CommonModule],
  templateUrl: './ww-timeline.component.html',
  styleUrl: './ww-timeline.component.scss',
})
export class WwTimelineComponent implements OnInit, OnDestroy {
  @Input() events: {
    startDate: Date;
    endDate: Date;
    name: string;
    eventType: WorkWellEventType;
  }[] = [];

  @Input() workDay: WorkWellEvent | null = null;
  @Input() isHorizontal = false; // Default to vertical timeline

  currentTime: Date = new Date(); // Property to hold the current time
  private clockTimeout: any; // To store the timeout reference
  private clockInterval: any; // To store the interval reference
  public startDayName = startDayName; // Expose startDayName for use in the template
  public endDayName = endDayName; // Expose endDayName for use in the template

  ngOnInit() {
    // Start an interval to update the time every milisecond

    this.clockInterval = setInterval(() => {
      this.updateTime();
    }, 1000); // Update every second
  }

  ngOnDestroy() {
    // Clear the timeout and interval when the component is destroyed
    if (this.clockTimeout) {
      clearTimeout(this.clockTimeout);
    }
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  private updateTime = () => {
    this.currentTime = new Date();
  };

  public isCurrentTimeInEvent(event: {
    startDate: Date;
    endDate: Date;
    name: string;
    eventType: WorkWellEventType;
  }): boolean {
    const now = this.currentTime.getTime();

    // Highlight StartDay if current time is before the workDay start
    if (
      event.name === startDayName &&
      this.workDay &&
      now < (this.workDay.startDate as Date).getTime()
    ) {
      return true;
    }

    // Highlight EndDay if current time is after the workDay end
    if (
      event.name === endDayName &&
      this.workDay &&
      now > (this.workDay.endDate as Date).getTime()
    ) {
      return true;
    }

    return now >= event.startDate.getTime() && now <= event.endDate.getTime();
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
      currentTime = event.endDate;
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
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
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
        return 'bg-red-500';
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

    let currentEvent = null;
    let nextEvent = null;

    for (let i = 0; i < filledEvents.length; i++) {
      const event = filledEvents[i];
      if (now >= event.startDate.getTime() && now <= event.endDate.getTime()) {
        currentEvent = event;
        nextEvent = filledEvents[i + 1] || null; // Get the next event if it exists
        break;
      } else if (now < event.startDate.getTime()) {
        nextEvent = event;
        break;
      }
    }

    // If no next event found and current time is after EndDay
    if (this.workDay && now > (this.workDay.endDate as Date).getTime()) {
      return { currentEvent: null, nextEvent: null };
    }

    // If no next event found, the next event is End Day
    if (!nextEvent && this.workDay) {
      nextEvent = {
        startDate: this.workDay.endDate as Date,
        endDate: this.workDay.endDate as Date,
        name: endDayName,
        eventType: WorkWellEventType.WORKDAY,
      };
    }

    // And if current time is before the first event, set currentEvent to Start Day
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

  public getTimeBetweenEvents(nextEvent: { startDate: Date } | null): string {
    if (!nextEvent) {
      return 'N/A';
    }

    const timeDiff = nextEvent.startDate.getTime() - this.currentTime.getTime(); // Corrected logic
    if (timeDiff < 0) {
      return '0 min 0 sec'; // If the next event has already started
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours} hour ${minutes} min ${seconds} sec`;
  }
}
