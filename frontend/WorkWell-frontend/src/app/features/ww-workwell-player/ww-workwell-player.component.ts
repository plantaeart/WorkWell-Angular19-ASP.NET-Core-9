import {
  Component,
  computed,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { WorkWellStore } from '../../store/workWell.store';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { WwTimelineComponent } from '../ww-timeline/ww-timeline.component';
import { WorkWellEvent } from '../../models/workWellEvent.model';
import { areEventsEqual } from '../../utils/workWellUtils';
import { WorkWell } from '../../models/workWell.model';
import { timer } from 'rxjs';
import { TimerService } from '../../core/services/timer.service';

@Component({
  selector: 'ww-workwell-player',
  imports: [CommonModule, WwTimelineComponent],
  templateUrl: './ww-workwell-player.component.html',
  styleUrls: ['./ww-workwell-player.component.scss'],
  animations: [
    trigger('slideInOut', [
      state(
        'hidden',
        style({
          transform: 'translateY(100%)',
          opacity: 0,
          height: '0px',
        })
      ),
      state(
        'visible',
        style({
          transform: 'translateY(0)',
          opacity: 1,
          height: '100%',
        })
      ),
      transition('hidden <=> visible', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class WwWorkwellPlayerComponent implements OnInit, OnDestroy {
  public workWellStore: WorkWellStore = inject(WorkWellStore);
  public isVisible: boolean = false; // Controls the visibility of the component
  public isRunning: boolean = true; // Controls the running state of the component
  public pauseButtonClass: string = 'bg-emerald-500 hover:bg-emerald-700';
  public isShowCurrentTime: boolean = true; // Controls the visibility of the current time
  public isLoading: boolean = this.workWellStore.loading(); // Controls the loading state of the component
  public isLoadingInitialWorkWellPlaying =
    this.workWellStore.loadingInitialWorkWellPlaying();
  public lastEvents: WorkWellEvent[] = [];
  public lastCloned: WorkWellEvent[] = [];
  public lastWorkDay: WorkWellEvent = new WorkWellEvent({});
  public lastClonedWorkDay: WorkWellEvent = new WorkWellEvent({});
  public currentTime = new Date();
  private timerSubscription: any;

  constructor(private timerService: TimerService, private ngZone: NgZone) {}

  ngOnInit() {
    console.log('Initializing WorkWell Player Component');
    this.timerSubscription = this.timerService.currentTime$.subscribe(
      (time) => {
        this.ngZone.run(() => {
          this.currentTime = time;
        });
      }
    );
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  toggleRunning() {
    this.isRunning = !this.isRunning;
    this.pauseButtonClass = this.isRunning
      ? 'bg-emerald-500 hover:bg-emerald-700'
      : 'bg-amber-500 hover:bg-amber-700';

    this.isShowCurrentTime = this.isRunning;
  }

  // Clone the workWell events to avoid mutating the original
  public clonedWorkWellEvents = computed(() => {
    const playing = this.workWellStore.workWellPlaying();
    if (
      this.workWellStore.isWorkWellPlaying() &&
      playing &&
      playing.workWellSchedule.length
    ) {
      const events = playing.workWellSchedule[0].allEvents();
      // Only clone if events changed
      if (!areEventsEqual(events, this.lastEvents)) {
        this.lastEvents = events;
        this.lastCloned = [...events];
      }
      return this.lastCloned;
    }
    return [];
  });

  // Clone the workWell object to avoid mutating the original
  public cloneWorkDay = computed(() => {
    const playing = this.workWellStore.workWellPlaying();
    if (
      this.workWellStore.isWorkWellPlaying() &&
      playing &&
      playing.workWellSchedule.length
    ) {
      const workDay = playing.workWellSchedule[0].workDay;
      // Only clone if workDay changed
      if (!workDay.equals(this.lastWorkDay)) {
        this.lastWorkDay = workDay;
        this.lastClonedWorkDay = new WorkWellEvent({ ...workDay });
      }
      return this.lastClonedWorkDay!;
    }
    return new WorkWellEvent({});
  });

  public workWellName = computed(() => {
    const playing = this.workWellStore.workWellPlaying();
    if (playing) {
      return playing.name;
    }
    return '';
  });

  public isWorkWellPlaying = computed(() => {
    return this.workWellStore.isWorkWellPlaying();
  });
}
