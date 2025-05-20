import { computed, inject, Injectable, signal } from '@angular/core';
import { WorkWell } from '../models/workWell.model';
import { firstValueFrom } from 'rxjs';
import { WorkWellApiService } from '../core/services/workWellApi.service';
import { WorkWellErrorType } from '../../types/enums/workWellErrorType';
import { WorkWellResponse } from '../models/errors/workWellResponse';
import { WorkWellSchedule } from '../models/workWellSchedule.model';
import { WorkWellEvent } from '../models/workWellEvent.model';

@Injectable({
  providedIn: 'root',
})
export class WorkWellStore {
  private workWellService = inject(WorkWellApiService);

  //* State
  workWellList = signal<WorkWell[]>([]);
  addNewWorkWell = signal<WorkWell>(new WorkWell({}));
  workWellPlaying = signal<WorkWell>(new WorkWell({ idWWS: -1 }));
  isWorkWellPlaying = signal<boolean>(false);
  loading = signal(false);
  error = signal<string | null>(null);

  //* Computed

  totalWorkWells = computed(() => this.workWellList().length);

  //* Actions

  // Reset addNewWorkWell state
  resetAddNewWorkWell() {
    this.addNewWorkWell.set(new WorkWell({}));
  }

  // Get all WorkWell data from API
  async getAllWorkWellFromStore() {
    this.loading.set(true);
    try {
      console.log('Fetching all work well data...');
      const res = await firstValueFrom(
        this.workWellService.getAllWorkWellFromApi()
      );
      this.workWellList.set(new Array<WorkWell>(...res));
      // Set workWellList workWellSchedule to new WorkWellSchedule
      this.workWellList.update((list) =>
        list.map((item) => {
          const schedule = item.workWellSchedule.map(
            (schedule: WorkWellSchedule) =>
              new WorkWellSchedule({ ...schedule })
          );
          return new WorkWell({ ...item, workWellSchedule: schedule });
        })
      );
      console.log('Checking if any work well is playing...');
    } catch (err) {
      if (err instanceof Error) {
        this.error.set(err.message); // Access message safely
      } else {
        this.error.set('An unknown error occurred'); // Handle non-Error types
      }
    } finally {
      this.loading.set(false);
    }
  }

  // Get WorkWell data by ID from API
  async getWorkWellByIdFromStore(idWWS: number) {
    this.loading.set(true);
    try {
      console.log(`Fetching work well data for ID: ${idWWS}...`);
      const res = await firstValueFrom(
        this.workWellService.getWorkWellByIdFromApi(idWWS)
      );
      this.workWellList.set([res]);
    } catch (err) {
      if (err instanceof Error) {
        this.error.set(err.message); // Access message safely
      } else {
        this.error.set('An unknown error occurred'); // Handle non-Error types
      }
    } finally {
      this.loading.set(false);
    }
  }

  // Create a new WorkWell data
  async createWorkWellFromStore(
    workWell: WorkWell
  ): Promise<WorkWellResponse | null> {
    this.loading.set(true);
    try {
      console.log('Creating new work well...');

      const res = await firstValueFrom(
        this.workWellService.createWorkWellFromApi(workWell)
      );
      this.workWellList.update((list) => [...list, res]);
      return null; // No error
    } catch (err) {
      if (err instanceof Error) {
        this.error.set(err.message); // Access message safely
      } else {
        this.error.set('An unknown error occurred'); // Handle non-Error types
      }

      return new WorkWellResponse({
        errorType: WorkWellErrorType.WORK_WELL_CREATION_FAILED,
        errorMessage: this.error(),
      });
    } finally {
      this.loading.set(false);
    }
  }

  // Update WorkWell data by ID
  async updateWorkWellFromStore(
    workWell: WorkWell
  ): Promise<WorkWellResponse | null> {
    this.loading.set(true);
    try {
      console.log(`Updating work well with ID: ${workWell.idWWS}...`);

      await firstValueFrom(
        this.workWellService.updateWorkWellFromApi(workWell)
      );
      this.workWellList.update((list) =>
        list.map((item) => (item.idWWS === workWell.idWWS ? workWell : item))
      );
      return null; // No error
    } catch (err) {
      if (err instanceof Error) {
        this.error.set(err.message); // Access message safely
      } else {
        this.error.set('An unknown error occurred'); // Handle non-Error types
      }

      return new WorkWellResponse({
        errorType: WorkWellErrorType.WORK_WELL_UPDATE_FAILED,
        errorMessage: this.error(),
      });
    } finally {
      this.loading.set(false);
    }
  }

  // Update isPlaying status of WorkWell data by ID
  async updateIsPlayingFromStore(
    idWWS: number,
    isPlaying: boolean
  ): Promise<WorkWellResponse | null> {
    this.loading.set(true);
    try {
      console.log(`Updating isPlaying status for ID: ${idWWS}...`);
      await firstValueFrom(
        this.workWellService.updateIsPlayingFromApi(idWWS, isPlaying)
      );
      if (isPlaying) {
        // Set isPlaying false to all other WorkWell entries except the one being updated
        this.workWellList.update((list) =>
          list.map((item) => {
            if (item.idWWS === idWWS) {
              return new WorkWell({ ...item, isPlaying: isPlaying });
            } else {
              return new WorkWell({ ...item, isPlaying: false });
            }
          })
        );
      } else {
        // Set isPlaying false to the WorkWell entry being updated
        this.workWellList.update((list) =>
          list.map((item) => {
            if (item.idWWS === idWWS) {
              return new WorkWell({ ...item, isPlaying: isPlaying });
            } else {
              return item;
            }
          })
        );
      }

      // Update the workWellPlaying signal
      this.getWorkWellPlaying();
      return null; // No error
    } catch (err) {
      if (err instanceof Error) {
        this.error.set(err.message); // Access message safely
      } else {
        this.error.set('An unknown error occurred'); // Handle non-Error types
      }

      return new WorkWellResponse({
        errorType: WorkWellErrorType.WORK_WELL_UPDATE_FAILED,
        errorMessage: this.error(),
      });
    } finally {
      this.loading.set(false);
    }
  }

  // Delete WorkWell data by ID
  async deleteWorkWellFromStore(idWWS: number) {
    this.loading.set(true);
    try {
      console.log(`Deleting work well with ID: ${idWWS}...`);
      // Simulate API call
      await firstValueFrom(
        this.workWellService.deleteWorkWellByIdFromApi(idWWS)
      );
      this.workWellList.update((list) =>
        list.filter((item) => item.idWWS !== idWWS)
      );
      // Update the workWellPlaying signal
      this.getWorkWellPlaying();
    } catch (err) {
      if (err instanceof Error) {
        this.error.set(err.message); // Access message safely
      } else {
        this.error.set('An unknown error occurred'); // Handle non-Error types
      }
    } finally {
      this.loading.set(false);
    }
  }

  // Set WorkWellPlaying state
  async getWorkWellPlaying() {
    const res = await firstValueFrom(
      this.workWellService.getWorkWellPlayingFromApi()
    );

    // Update the workWellPlaying signal
    this.workWellPlaying.set(
      res != null
        ? new WorkWell({
            ...res,
            workWellSchedule: (res.workWellSchedule || []).map(
              (s: any) =>
                new WorkWellSchedule({
                  ...s,
                  meetings: (s.meetings || []).map(
                    (m: any) => new WorkWellEvent({ ...m })
                  ),
                  pauses: (s.pauses || []).map(
                    (p: any) => new WorkWellEvent({ ...p })
                  ),
                  lunch: s.lunch
                    ? new WorkWellEvent({ ...s.lunch })
                    : undefined,
                  workDay: s.workDay
                    ? new WorkWellEvent({ ...s.workDay })
                    : undefined,
                })
            ),
          })
        : new WorkWell({ idWWS: -1 })
    );

    // Update the isWorkWellPlaying signal
    this.isWorkWellPlaying.set(this.workWellPlaying().idWWS != -1);
    console.log('isWorkWellPlaying', this.isWorkWellPlaying());
    if (this.workWellPlaying().idWWS != -1) {
      console.log('Work well is playing, idWWS:', this.workWellPlaying().idWWS);
    }
  }
}
