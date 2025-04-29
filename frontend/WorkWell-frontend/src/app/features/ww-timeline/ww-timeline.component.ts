import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkWellEventType } from '../../../types/enums/workWellEventType';

@Component({
  selector: 'ww-timeline',
  imports: [CommonModule],
  templateUrl: './ww-timeline.component.html',
  styles: [],
})
export class WwTimelineComponent {
  @Input() events: {
    startDate: Date;
    endDate: Date;
    name: string;
    eventType: WorkWellEventType;
  }[] = [];

  get sortedEvents() {
    return this.events.sort(
      (a, b) => a.startDate.getTime() - b.startDate.getTime()
    );
  }

  getEventClass(eventType: WorkWellEventType): string {
    switch (eventType) {
      case WorkWellEventType.WORKDAY:
        return 'bg-blue-500';
      case WorkWellEventType.LUNCH:
        return 'bg-green-500';
      case WorkWellEventType.MEETING:
        return 'bg-yellow-500';
      case WorkWellEventType.PAUSE:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }
}
