import { Component, inject } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { WorkWellStore } from '../../../../store/workWell.store';
import { formatDateToHHmm } from '../../../../utils/string.utils';
import { convertWorkWellTimeToDate } from '../../../../utils/workWellUtils';
import { CommonModule } from '@angular/common';
import { WwTimelineComponent } from '../../../ww-timeline/ww-timeline.component';
import {
  lunchName,
  meetingName,
  pauseName,
} from '../../../../../types/enums/workWellEventName';
import { Router } from '@angular/router';
import { WorkWell } from '../../../../models/workWell.model';
import { RouterModule } from '@angular/router';
import { WorkWellSchedule } from '../../../../models/workWellSchedule.model';

@Component({
  selector: 'ww-step-5',
  imports: [RouterModule, TimelineModule, CommonModule, WwTimelineComponent],
  templateUrl: './ww-step-5.component.html',
  styleUrl: './ww-step-5.component.scss',
})
export class WwStep5Component {
  events: any[] = [];
  public workWellStore = inject(WorkWellStore);

  formatDateToHHmm = formatDateToHHmm;

  // Example data for workDay, lunch, meetings, and pauses
  workDay =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].workDay ?? {};
  lunch = this.workWellStore.addNewWorkWell().workWellSchedule[0].lunch ?? {};
  meetings =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings ?? [];
  pauses = this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses ?? [];

  constructor(private router: Router) {
    convertWorkWellTimeToDate({
      workDay: this.workDay,
      lunch: this.lunch,
      meetings: this.meetings,
      pauses: this.pauses,
    });

    this.events = [
      {
        startDate: this.lunch.startDate,
        endDate: this.lunch.endDate,
        name: lunchName,
        eventType: this.lunch.eventType,
      },
      ...this.meetings.map((meeting, index) => ({
        startDate: meeting.startDate,
        endDate: meeting.endDate,
        name: meetingName + ' ' + (index + 1),
        eventType: meeting.eventType,
      })),
      ...this.pauses.map((pause, index) => ({
        startDate: pause.startDate,
        endDate: pause.endDate,
        name: pauseName + ' ' + (index + 1),
        eventType: pause.eventType,
      })),
    ];
  }

  async save(): Promise<void> {
    // Save the work well schedule to the store or perform any other action
    const workWellToSave: WorkWell = new WorkWell({
      idWWS: this.workWellStore.addNewWorkWell().idWWS,
      name: this.workWellStore.addNewWorkWell().name,
      description: this.workWellStore.addNewWorkWell().description,
      isPlaying: this.workWellStore.addNewWorkWell().isPlaying,
      nbDayWork: this.workWellStore.addNewWorkWell().nbDayWork,
      updateDate: this.workWellStore.addNewWorkWell().updateDate,
      scheduleType: this.workWellStore.addNewWorkWell().scheduleType,
      // get all the work well schedule
      workWellSchedule: [
        ...this.workWellStore.addNewWorkWell().workWellSchedule,
      ],
    });

    // Save the work well
    const resp = await this.workWellStore.createWorkWellFromStore(
      workWellToSave
    );

    if (resp) {
      console.error('Error creating work well:', resp);
      // Handle error (e.g., show a notification)
    } else {
      console.log('Work well created successfully!');
      // Navigate to the home page
      this.router.navigate(['/']);
    }
  }
}
