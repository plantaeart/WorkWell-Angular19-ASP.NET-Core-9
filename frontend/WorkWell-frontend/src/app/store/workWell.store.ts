import { computed, inject, Injectable, signal } from '@angular/core';
import { WorkWell } from '../models/workWell.model';
import { firstValueFrom } from 'rxjs';
import { WorkWellApiService } from '../core/services/workWellApi.service';

@Injectable({
  providedIn: 'root',
})
export class WorkWellStore {
  private workWellService = inject(WorkWellApiService);

  // State
  workWellList = signal<WorkWell[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Computed
  totalWorkWells = computed(() => this.workWellList().length);

  // Get all WorkWell data from API
  async getAllWorkWellFromStore() {
    this.loading.set(true);
    try {
      console.log('Fetching all work well data...');
      const res = await firstValueFrom(
        this.workWellService.getAllWorkWellFromApi()
      );
      this.workWellList.set(res);
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
  async createWorkWellFromStore(workWell: WorkWell) {
    this.loading.set(true);
    try {
      console.log('Creating new work well...');

      const res = await firstValueFrom(
        this.workWellService.createWorkWellFromApi(workWell)
      );
      this.workWellList.update((list) => [...list, res]);
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
