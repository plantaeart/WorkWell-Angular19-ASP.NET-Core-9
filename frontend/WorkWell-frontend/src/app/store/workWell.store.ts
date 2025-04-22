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
  async getAllWorkWell() {
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
}
