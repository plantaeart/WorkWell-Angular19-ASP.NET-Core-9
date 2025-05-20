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

@Component({
  selector: 'ww-timeline',
  imports: [CommonModule],
  templateUrl: './ww-timeline.component.html',
  styleUrl: './ww-timeline.component.scss',
})
export class WwTimelineComponent implements OnInit, OnDestroy {
  @Input() workWellName = ''; // Default to workDayName
  @Input() events: WorkWellEvent[] = [];
  @Input() workDay: WorkWellEvent = new WorkWellEvent({}); // Default to empty workDay
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
        endDate: this.workDay.startDate,
        name: startDayName,
        eventType: WorkWellEventType.WORKDAY,
      });

      this.workDayEnd = new WorkWellEvent({
        startDate: this.workDay.endDate,
        endDate: this.workDay.endDate,
        name: endDayName,
        eventType: WorkWellEventType.WORKDAY,
      });
    }
  }

  ngOnInit() {
    console.log(
      'Initializing WwTimelineComponent for workWellName:',
      this.workWellName
    );
    /*this.events = [...this.events];
    this.workDay = new WorkWellEvent({
      ...this.workDay,
    });*/

    console.log(
      'test to interval',
      this.isShowCurrentTime && this.events.length > 0
    );
    if (this.isShowCurrentTime && this.events.length > 0) {
      console.log('Setting up clock interval');
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
        this.clockInterval = null;
      }
      if (this.clockInterval) {
        clearInterval(this.clockInterval);
        this.clockTimeout = null;
      }
    }
  }

  private updateTime = () => {
    this.currentTime = new Date();
  };

  public isCurrentTimeInEvent(event: WorkWellEvent): boolean {
    if (this.isShowCurrentTime) {
      const now = this.currentTime.getTime();

      // Check if the current time is within 1 hour before the workday starts
      if (this.workDayStart) {
        const oneHourBeforeStart = new Date(
          this.workDayStart.startDateDateFormat.getTime() - 60 * 60 * 1000
        );
        if (
          now >= oneHourBeforeStart.getTime() &&
          now < this.workDayStart.startDateDateFormat.getTime()
        ) {
          return event === this.workDayStart; // Highlight workDayStart only before the day starts
        }
      }

      // Ensure workDayStart is not highlighted after the day starts
      if (
        event === this.workDayStart &&
        now >= this.workDayStart.startDateDateFormat.getTime()
      ) {
        return false;
      }

      // Ensure workDayEnd is not highlighted before the day ends
      if (
        event === this.workDayEnd &&
        now < this.workDayEnd.endDateDateFormat.getTime()
      ) {
        return false;
      }

      // Check if the current time is after the workday ends
      if (
        this.workDayEnd &&
        now > this.workDayEnd.endDateDateFormat.getTime()
      ) {
        return event === this.workDayEnd; // Highlight workDayEnd
      }

      // Check if the current time is within the event's time range
      return (
        now >= event.startDateDateFormat.getTime() &&
        now <= event.endDateDateFormat.getTime()
      );
    }
    return false; // If isShowCurrentTime is false, do not highlight any event
  }

  get filledEvents() {
    if (!this.workDay) {
      return this.sortedEvents; // If no workDay is provided, return sorted events as is
    }

    const filledEvents = [];
    let currentTime = this.workDay.startDateDateFormat; // Start from the workday start time

    // Sort events by start time
    const sorted = this.sortedEvents;

    // Fill gaps with empty events
    for (const event of sorted) {
      if (currentTime < event.startDateDateFormat) {
        filledEvents.push(
          new WorkWellEvent({
            startDateDateFormat: currentTime,
            endDateDateFormat: event.startDateDateFormat,
            name: workHoursName,
            eventType: WorkWellEventType.NONE, // Custom type for empty events
          })
        );
      }
      filledEvents.push(event);
      currentTime = event.endDateDateFormat as Date;
    }

    // Add an empty event for the time after the last event until the end of the workday
    if (currentTime < this.workDay.endDateDateFormat) {
      filledEvents.push(
        new WorkWellEvent({
          startDateDateFormat: currentTime,
          endDateDateFormat: this.workDay.endDateDateFormat,
          name: workHoursName,
          eventType: WorkWellEventType.NONE,
        })
      );
    }

    return filledEvents;
  }

  get sortedEvents() {
    return this.events.sort(
      (a, b) =>
        a.startDateDateFormat.getTime() - b.startDateDateFormat.getTime()
    );
  }

  public getEventClass(eventType: WorkWellEventType | undefined): string {
    switch (eventType) {
      case WorkWellEventType.WORKDAY:
        return 'bg-blue-500';
      case WorkWellEventType.LUNCH:
        return 'bg-emerald-500';
      case WorkWellEventType.MEETING:
        return 'bg-amber-500';
      case WorkWellEventType.PAUSE:
        return 'bg-rose-500';
      case WorkWellEventType.NONE:
        return 'bg-stone-500';
      default:
        return 'bg-stone-500';
    }
  }

  public getIsHorizontal(): string {
    return this.isHorizontal ? 'flex-row' : 'flex-col';
  }

  public getIsHorizontalTop(): string {
    return this.isHorizontal ? 'flex-col' : 'flex-row';
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
        this.workDayStart.startDateDateFormat.getTime() - 60 * 60 * 1000
      );
      if (
        now >= oneHourBeforeStart.getTime() &&
        now < this.workDayStart.startDateDateFormat.getTime()
      ) {
        return {
          currentEvent: this.workDayStart,
          nextEvent: filledEvents[0] || null,
        };
      }
    }

    // Check if we are after the workday ends
    if (this.workDayEnd && now > this.workDayEnd.endDateDateFormat.getTime()) {
      return { currentEvent: this.workDayEnd, nextEvent: null };
    }

    // New var to have filledEvents + workDayStart and workDayEnd
    const filledEventsWithWorkDay = [
      this.workDayStart,
      ...filledEvents,
      this.workDayEnd,
    ];

    // Loop through events to find the current and next events
    for (let i = 0; i < filledEventsWithWorkDay.length; i++) {
      const event = filledEventsWithWorkDay[i];
      if (
        now >= event.startDateDateFormat.getTime() &&
        now <= event.endDateDateFormat.getTime()
      ) {
        currentEvent = event;
        nextEvent = filledEventsWithWorkDay[i + 1] || null; // Get the next event if it exists
        break;
      } else if (now < event.startDateDateFormat.getTime()) {
        nextEvent = event;
        break;
      }
    }

    // If no current event is found and the current time is before the first event, set currentEvent to Start Day
    if (!currentEvent && this.workDay) {
      currentEvent = this.workDayStart; // Set to Start Day if no current event is found
    }

    return { currentEvent, nextEvent };
  }

  public getTimeBetweenEvents(
    nextEvent: { startDateDateFormat: Date | undefined } | null
  ): string {
    if (!nextEvent) {
      return 'N/A';
    }

    const timeDiff =
      (nextEvent.startDateDateFormat as Date).getTime() -
      this.currentTime.getTime(); // Corrected logic
    if (timeDiff < 0) {
      return '0 min 0 sec'; // If the next event has already started
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours} hour ${minutes} min ${seconds} sec`;
  }
}
