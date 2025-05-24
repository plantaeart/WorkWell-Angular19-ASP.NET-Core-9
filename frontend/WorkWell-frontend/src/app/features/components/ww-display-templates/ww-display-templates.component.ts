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
import { FormsModule } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'ww-display-templates',
  imports: [
    ButtonModule,
    CommonModule,
    WwTimelineComponent,
    PanelModule,
    ConfirmPopupModule,
    ToastModule,
    FormsModule,
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
  public workWellToDuplicate: WorkWell | null = null;

  public editingWorkWellId: number | null = null;
  public editedName: string = '';
  @ViewChild('nameInput') nameInput!: ElementRef;

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

  // Add these methods for inline editing
  startEditing(workWell: WorkWell) {
    this.editingWorkWellId = workWell.idWWS;
    this.editedName = workWell.name;

    // Focus the input after it renders
    setTimeout(() => {
      if (this.nameInput) {
        this.nameInput.nativeElement.focus();
      }
    }, 0);
  }

  cancelEditing() {
    this.editingWorkWellId = null;
    this.editedName = '';
  }

  saveWorkWellName(workWell: WorkWell) {
    if (!this.editedName.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'WorkWell name cannot be empty',
        life: 3000,
      });
      return;
    }

    const originalName = workWell.name;
    workWell.name = this.editedName.trim();

    // Update the WorkWell in the store
    this.workWellStore.updateWorkWellFromStore(workWell).then((resp) => {
      if (resp && resp.errorType) {
        console.error('Error updating WorkWell name:', resp.errorMessage);
        // Revert name on error
        workWell.name = originalName;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update WorkWell name',
          life: 3000,
        });
      } else {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'WorkWell name updated successfully',
          life: 3000,
        });
      }
      this.editingWorkWellId = null;
    });
  }

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Delete the selected work well?',
      key: 'deleteConfirm',
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

  // Add this method for confirmation
  confirmDuplicate(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Duplicate this WorkWell?',
      key: 'duplicateConfirm',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'You have duplicated the work well',
          life: 3000,
        });
      },
    });
  }

  async duplicateWorkWell(workWell: WorkWell | null) {
    // Check if workWell is null or undefined
    if (!workWell) return;

    // Create a deep copy of the WorkWell
    const duplicatedWorkWell = new WorkWell({
      ...workWell,
      name: `${workWell.name}-copied`,
      idWWS: undefined, // Remove ID so the backend generates a new one
      isPlaying: false, // Ensure the copy isn't playing
      isLocked: false, // Start unlocked
    });

    try {
      // Save the new WorkWell
      const response = await this.workWellStore.createWorkWellFromStore(
        duplicatedWorkWell
      );

      if (response && response.errorType) {
        console.error('Error duplicating WorkWell:', response.errorMessage);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to duplicate WorkWell',
          life: 3000,
        });
      } else {
        if (response) {
          console.log(response.data);
          const newWorkWell = response.data;
          // Get the newly created WorkWell with its ID
          // Add to local list for immediate UI update
          this.workWellList = [...this.workWellList, newWorkWell];
        }
      }
    } catch (error) {
      console.error('Error during WorkWell duplication:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An unexpected error occurred while duplicating the WorkWell',
        life: 3000,
      });
    }
  }

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
