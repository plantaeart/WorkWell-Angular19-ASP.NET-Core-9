import { computed, inject, Injectable, signal } from '@angular/core';
import { WorkWell } from '../models/workWell.model';
import { firstValueFrom } from 'rxjs';
import { WorkWellApiService } from '../core/services/workWellApi.service';
import { convertWorkWellTimeToString } from '../utils/workWellUtils';
import { WorkWellErrorType } from '../../types/enums/workWellErrorType';
import { WorkWellResponse } from '../models/errors/workWellResponse';

@Injectable({
  providedIn: 'root',
})
export class WorkWellStore {
  private workWellService = inject(WorkWellApiService);

  // State
  workWellList = signal<WorkWell[]>([]);
  addNewWorkWell = signal<WorkWell>(new WorkWell({}));
  loading = signal(false);
  error = signal<string | null>(null);

  // Computed
  totalWorkWells = computed(() => this.workWellList().length);

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

      convertWorkWellTimeToString({
        workDay: workWell.workWellSchedule[0].workDay,
        lunch: workWell.workWellSchedule[0].lunch,
        meetings: workWell.workWellSchedule[0].meetings,
        pauses: workWell.workWellSchedule[0].pauses,
      });

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

      convertWorkWellTimeToString({
        workDay: workWell.workWellSchedule[0].workDay,
        lunch: workWell.workWellSchedule[0].lunch,
        meetings: workWell.workWellSchedule[0].meetings,
        pauses: workWell.workWellSchedule[0].pauses,
      });

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
}
