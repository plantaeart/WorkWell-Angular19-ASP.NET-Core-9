import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  SimpleChanges,
  NgZone,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkWellEventType } from '../../../types/enums/workWellEventType';
import { WorkWellEvent } from '../../models/workWellEvent.model';
import {
  endDayName,
  startDayName,
  workHoursName,
} from '../../../types/enums/workWellEventName';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TimerService } from '../../core/services/timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ww-timeline',
  imports: [CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './ww-timeline.component.html',
  styleUrl: './ww-timeline.component.scss',
})
export class WwTimelineComponent implements OnInit, OnDestroy {
  @Input() workWellName: string = ''; // Default to workDayName
  @Input() events: WorkWellEvent[] = [];
  @Input() workDay: WorkWellEvent = new WorkWellEvent({}); // Default to empty workDay
  @Input() isHorizontal: boolean = false; // Default to vertical timeline
  @Input() isShowCurrentTime: boolean = true; // Default to show current time
  @Input() alertTimeBeforeEvent: number = 5; // Default to 5 minutes
  @Input() isShowNotifications: boolean = false; // Default to show notifications

  // Convert to signal for better reactivity
  currentTime = signal(new Date());

  // Add signals for derived values that depend on time
  timeUntilNextEvent = signal('N/A');
  currentAndNextEvents = signal<{
    currentEvent: WorkWellEvent | null;
    nextEvent: WorkWellEvent | null;
  }>({ currentEvent: null, nextEvent: null });
  secondsPercentage = signal(0);

  private clockInterval: any;
  private clockNotification: any;
  private timerSubscription: Subscription | null = null;

  public startDayName = startDayName;
  public endDayName = endDayName;

  public workDayStart!: WorkWellEvent;
  public workDayEnd!: WorkWellEvent;

  constructor(
    private timerService: TimerService,
    private messageService: MessageService,
    private ngZone: NgZone
  ) {}

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

    // If events changed and workWellName too and no intervals are set, set them
    if (
      changes['events'] &&
      changes['workWellName'] &&
      this.events.length > 0 &&
      this.workWellName !== ''
    ) {
      console.log('Update timeline !');
      this.setIntervals();
    }
  }

  ngOnInit() {
    console.log(
      'Initializing WwTimelineComponent for workWellName:',
      this.workWellName
    );
    this.clearIntervals();
    this.setIntervals();
  }

  ngOnDestroy() {
    this.clearIntervals();
  }

  private setIntervals() {
    this.ngZone.runOutsideAngular(() => {
      if (this.isShowCurrentTime && this.events.length > 0) {
        // Use the synchronized timer service
        this.timerSubscription = this.timerService.currentTime$.subscribe(
          (time) => {
            this.ngZone.run(() => {
              // Update all time-dependent values at once for synchronization
              this.currentTime.set(time);

              // Calculate seconds percentage for progress bar
              this.secondsPercentage.set((time.getSeconds() / 60) * 100);

              // Update current and next events
              const events = this.calculateCurrentAndNextEvents(time);
              this.currentAndNextEvents.set(events);

              // Update time until next event
              if (events.nextEvent) {
                this.timeUntilNextEvent.set(
                  this.calculateTimeBetweenEvents({
                    startDateDateFormat: events.nextEvent.startDateDateFormat,
                  })
                );
              } else {
                this.timeUntilNextEvent.set('N/A');
              }
            });
          }
        );

        if (this.isShowNotifications) {
          // Notification timing logic
          const now = new Date();
          const msToNextMinute =
            (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

          this.clockNotification = setTimeout(() => {
            this.notifiCationChecker();
            // Set interval to run every minute, exactly on the minute
            this.clockNotification = setInterval(() => {
              this.notifiCationChecker();
            }, 60 * 1000);
          }, msToNextMinute);
        }
      }
    });
  }

  private clearIntervals() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }

    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }

    if (this.clockNotification) {
      clearTimeout(this.clockNotification);
      clearInterval(this.clockNotification);
      this.clockNotification = null;
    }
  }

  private notifiCationChecker = () => {
    if (this.isShowNotifications) {
      this.ngZone.run(() => {
        const events = this.currentAndNextEvents();
        this.showNotification(events.currentEvent, events.nextEvent);
      });
    }
  };

  public isCurrentTimeInEvent(event: WorkWellEvent): boolean {
    if (this.isShowCurrentTime) {
      const now = this.currentTime().getTime();

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

  // Calculate current and next events using the current time
  private calculateCurrentAndNextEvents(time: Date) {
    const now = time.getTime();

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

  // Calculate time between events using the current time
  private calculateTimeBetweenEvents(
    nextEvent: { startDateDateFormat: Date | undefined } | null
  ): string {
    if (!nextEvent) {
      return 'N/A';
    }

    const timeDiff =
      (nextEvent.startDateDateFormat as Date).getTime() -
      this.currentTime().getTime();

    if (timeDiff < 0) {
      return '0 min 0 sec'; // If the next event has already started
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours} hour ${minutes} min ${seconds} sec`;
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
    return this.currentAndNextEvents();
  }

  public getTimeBetweenEvents(
    nextEvent: { startDateDateFormat: Date | undefined } | null
  ): string {
    return this.calculateTimeBetweenEvents(nextEvent);
  }

  // Method that will trigger every alterTimeBeforeEvent minutes a toast to announce the next event
  public async showNotification(
    event: WorkWellEvent | null,
    nextEvent: WorkWellEvent | null
  ): Promise<void> {
    if (this.isShowNotifications && event && nextEvent) {
      const timeDiff =
        (nextEvent.startDateDateFormat as Date).getTime() -
        this.currentTime().getTime();
      if (timeDiff < 0) {
        return; // If the next event has already started
      }

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      // Notify X minutes before any event
      if (
        hours === 0 &&
        minutes === this.alertTimeBeforeEvent &&
        seconds === 0
      ) {
        this.messageService.add({
          sticky: true,
          severity: 'contrast',
          summary: `Notification: ${event.name} will start in ${this.alertTimeBeforeEvent} minutes!`,
        });
        return;
      }

      // Notify X minutes before the start of the day
      if (
        nextEvent === this.workDayStart &&
        hours === 0 &&
        minutes === this.alertTimeBeforeEvent &&
        seconds === 0
      ) {
        this.messageService.add({
          sticky: true,
          severity: 'info',
          summary: `Notification: Workday starts in ${this.alertTimeBeforeEvent} minutes!`,
        });
        return;
      }
    }

    this.messageService.add({
      sticky: true,
      severity: 'info',
      summary: `Tests in ${this.alertTimeBeforeEvent} minutes!`,
    });

    console.log('here !!');
  }
}
