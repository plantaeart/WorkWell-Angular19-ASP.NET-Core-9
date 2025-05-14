import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { WorkWellStore } from '../../../store/workWell.store';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { WwTimelineComponent } from '../../ww-timeline/ww-timeline.component';
import {
  convertWorkWellTimeToDate,
  workWellListMapping,
} from '../../../utils/workWellUtils';
import { WorkWell } from '../../../models/workWell.model';
import { WorkWellResponse } from '../../../models/errors/workWellResponse';

@Component({
  selector: 'ww-display-templates',
  imports: [ButtonModule, CommonModule, WwTimelineComponent],
  templateUrl: './ww-display-templates.component.html',
  styleUrl: './ww-display-templates.component.scss',
  animations: [
    trigger('listAnimation', [
      // Animation for adding an element
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      // Animation for removing an element
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'scale(0.9)' })
        ),
      ]),
    ]),
  ],
})
export class WwDisplayTemplatesComponent {
  public isDebug = signal(environment.debug);

  private workWellStore = inject(WorkWellStore);
  public workWellList: WorkWell[] = [...workWellListMapping()];
  public isLoading = this.workWellStore.loading;

  constructor(private router: Router) {
    // foreach workWellList and convert startDate and endDate to Date objects
    this.workWellList.forEach((workWell) => {
      workWell.workWellSchedule.forEach((schedule) => {
        convertWorkWellTimeToDate({
          workDay: schedule.workDay,
          lunch: schedule.lunch,
          meetings: schedule.meetings,
          pauses: schedule.pauses,
        });
      });
    });
  }

  deleteWorkWellByIdFromTemplate = (idWWS: number) => {
    this.workWellStore.deleteWorkWellFromStore(idWWS);
    // Update the workWellList by filtering out the deleted item
    this.workWellList = this.workWellList.filter(
      (workWell) => workWell.idWWS !== idWWS
    );
  };

  // Update the isPlaying status of a WorkWell entry
  async playWorkWell(idWWS: number) {
    const workWellToUpdate = this.workWellList.find(
      (workWell) => workWell.idWWS === idWWS
    );
    if (workWellToUpdate) {
      workWellToUpdate.isPlaying = !workWellToUpdate.isPlaying;
      const resp: WorkWellResponse | null =
        await this.workWellStore.updateIsPlayingFromStore(
          idWWS,
          workWellToUpdate.isPlaying
        );

      if (resp && resp.errorType) {
        console.error('Error updating isPlaying status:', resp.errorMessage);
      } else {
        if (workWellToUpdate.isPlaying) {
          // If isPlaying is true, set all other WorkWell entries to false
          this.workWellList.forEach((workWell) => {
            if (workWell.idWWS !== idWWS) {
              workWell.isPlaying = false;
            }
          });
        }
        // Else if isPlaying is false, set the WorkWell entry to false
        else {
          this.workWellList.forEach((workWell) => {
            if (workWell.idWWS === idWWS) {
              workWell.isPlaying = false;
            }
          });
        }
      }
    }
  }

  // Navigate to the "addNewWorkWell" page
  navigateToAddNewWorkWell() {
    this.router.navigate(['/addNewWorkWell']);
  }
}
