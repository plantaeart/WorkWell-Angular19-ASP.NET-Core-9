import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { WorkWellStore } from '../../../store/workWell.store';
import { trigger, transition, style, animate } from '@angular/animations';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { WwTimelineComponent } from '../../ww-timeline/ww-timeline.component';
import { workWellListMapping } from '../../../utils/workWellUtils';
import { WorkWell } from '../../../models/workWell.model';
import { WorkWellResponse } from '../../../models/errors/workWellResponse';
import { WorkWellEvent } from '../../../models/workWellEvent.model';
import { PanelModule } from 'primeng/panel';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'ww-display-templates',
  imports: [
    ButtonModule,
    CommonModule,
    WwTimelineComponent,
    PanelModule,
    ConfirmPopupModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
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
  public workWellToDelete: number | null = null;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    // Update the workWellPlaying signal
    this.workWellStore.getWorkWellPlaying();
    this.workWellStore.setIsUpdateState(false); // Reset the update state
    this.workWellStore.setAddNewWorkWell(new WorkWell({})); // Reset the new work well state
  }

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Delete the selected work well?',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'You have deleted the work well',
          life: 3000,
        });
      },
    });
  }

  deleteWorkWellByIdFromTemplate = (idWWS: number | null) => {
    console.log('Deleting work well with idWWS:', idWWS);

    if (idWWS === null) {
      console.error('Invalid work well ID:', idWWS);
      return;
    }
    this.workWellStore.deleteWorkWellFromStore(idWWS);
    // Update the workWellList by filtering out the deleted item
    this.workWellList = this.workWellList.filter(
      (workWell) => workWell.idWWS !== idWWS
    );
  };

  updateWorkWell(workWell: WorkWell) {
    this.workWellStore.setAddNewWorkWell(workWell);
    this.workWellStore.setIsUpdateState(true);
    this.router.navigate(['/addNewWorkWell']);
  }

  // Update the isPlaying status of a WorkWell entry
  async playWorkWell(idWWS: number) {
    console.log('update isPlaying status for WorkWell with idWWS:', idWWS);
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

    // Update the workWellPlaying signal
    this.workWellStore.getWorkWellPlaying();
  }

  // Update the isLocked status of a WorkWell entry
  async lockWorkWell(idWWS: number) {
    console.log('update isLocked status for WorkWell with idWWS:', idWWS);
    const workWellToUpdate = this.workWellList.find(
      (workWell) => workWell.idWWS === idWWS
    );
    if (workWellToUpdate) {
      workWellToUpdate.isLocked = !workWellToUpdate.isLocked;
      const resp: WorkWellResponse | null =
        await this.workWellStore.updateIsLockedFromStore(
          idWWS,
          workWellToUpdate.isLocked
        );

      if (resp && resp.errorType) {
        console.error('Error updating isLocked status:', resp.errorMessage);
      }
    }
  }

  public getClonedWorkWellEvents(workWell: WorkWell): WorkWellEvent[] {
    // Clone the workWell object to avoid mutating the original
    return [...workWell.workWellSchedule[0].allEvents()];
  }

  public getCloneWorkDay(workWell: WorkWell): WorkWellEvent {
    // Clone the workWell object to avoid mutating the original
    return new WorkWellEvent({ ...workWell.workWellSchedule[0].workDay });
  }

  // Navigate to the "addNewWorkWell" page
  navigateToAddNewWorkWell() {
    this.router.navigate(['/addNewWorkWell']);
  }
}
