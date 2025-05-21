import { Component, inject } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { WorkWellStore } from '../../../../store/workWell.store';
import { formatDateToHHmm } from '../../../../utils/string.utils';
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
import { WorkWellEvent } from '../../../../models/workWellEvent.model';

@Component({
  selector: 'ww-step-5',
  imports: [RouterModule, TimelineModule, CommonModule, WwTimelineComponent],
  templateUrl: './ww-step-5.component.html',
  styleUrl: './ww-step-5.component.scss',
})
export class WwStep5Component {
  public events: WorkWellEvent[] = [];
  public workWellStore = inject(WorkWellStore);

  formatDateToHHmm = formatDateToHHmm;

  // Example data for workDay, lunch, meetings, and pauses
  public workDay: WorkWellEvent =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].workDay ?? {};
  public lunch: WorkWellEvent =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].lunch ?? {};
  public meetings: WorkWellEvent[] =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].meetings ?? [];
  public pauses: WorkWellEvent[] =
    this.workWellStore.addNewWorkWell().workWellSchedule[0].pauses ?? [];

  public isUpdateState = this.workWellStore.isUpdateState();

  constructor(private router: Router) {
    this.events = [
      new WorkWellEvent({
        startDate: this.lunch.startDate,
        endDate: this.lunch.endDate,
        name: lunchName,
        eventType: this.lunch.eventType,
      }),
      ...this.meetings.map(
        (meeting, index) =>
          new WorkWellEvent({
            startDate: meeting.startDate,
            endDate: meeting.endDate,
            name: meetingName + ' ' + (index + 1),
            eventType: meeting.eventType,
          })
      ),
      ...this.pauses.map(
        (pause, index) =>
          new WorkWellEvent({
            startDate: pause.startDate,
            endDate: pause.endDate,
            name: pauseName + ' ' + (index + 1),
            eventType: pause.eventType,
          })
      ),
    ];
  }

  async save(): Promise<void> {
    // Save the work well schedule to the store or perform any other action
    const workWellToSave: WorkWell = new WorkWell({
      ...this.workWellStore.addNewWorkWell(),
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
      // Reset the add new work well state
      this.workWellStore.resetAddNewWorkWell();
      this.workWellStore.setIsUpdateState(false);
      // Navigate to the home page
      this.router.navigate(['/']);
    }
  }

  async update(): Promise<void> {
    // Update the work well schedule to the store or perform any other action
    const workWellToUpdate: WorkWell = new WorkWell({
      ...this.workWellStore.addNewWorkWell(),
      // get all the work well schedule
      workWellSchedule: [
        ...this.workWellStore.addNewWorkWell().workWellSchedule,
      ],
    });

    // Update the work well
    const resp = await this.workWellStore.updateWorkWellFromStore(
      workWellToUpdate
    );

    if (resp) {
      console.error('Error updating work well:', resp);
      // Handle error (e.g., show a notification)
    } else {
      console.log('Work well updated successfully!');
      // Reset the add new work well state
      this.workWellStore.resetAddNewWorkWell();
      this.workWellStore.setIsUpdateState(false);
      // Navigate to the home page
      this.router.navigate(['/']);
    }
  }
}
