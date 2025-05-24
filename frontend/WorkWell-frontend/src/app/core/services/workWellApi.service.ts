// src/app/core/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { WorkWell } from '../../models/workWell.model';
import { Observable } from 'rxjs';
import { WorkWellResponse } from '../../models/errors/workWellResponse';

@Injectable({ providedIn: 'root' })
export class WorkWellApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all WorkWell data from API
  getAllWorkWellFromApi(): Observable<WorkWell[]> {
    return this.http.get<WorkWell[]>(
      `${this.baseUrl}/api/WorkWell/GetAllWorkWell`
    );
  }

  // Get WorkWell data by ID from API
  getWorkWellByIdFromApi(idWWS: number): Observable<WorkWell> {
    return this.http.get<WorkWell>(
      `${this.baseUrl}/api/WorkWell/GetWorkWellById/${idWWS}`
    );
  }

  // Get WorkWell playing from API
  getWorkWellPlayingFromApi(): Observable<WorkWell> {
    return this.http.get<WorkWell>(
      `${this.baseUrl}/api/WorkWell/GetPlayingWorkWell`
    );
  }

  // Create a new WorkWell entry in the API
  createWorkWellFromApi(workWell: WorkWell): Observable<WorkWellResponse> {
    return this.http.post<WorkWellResponse>(
      `${this.baseUrl}/api/WorkWell/CreateWorkWell`,
      workWell
    );
  }

  // Update an existing WorkWell entry in the API
  updateWorkWellFromApi(workWell: WorkWell): Observable<WorkWell> {
    let idWWS = workWell.idWWS;
    return this.http.put<WorkWell>(
      `${this.baseUrl}/api/WorkWell/UpdateWorkWellById/${idWWS}`,
      workWell
    );
  }

  // Update isPlaying status of a WorkWell entry in the API
  updateIsPlayingFromApi(
    idWWS: number,
    isPlaying: boolean
  ): Observable<WorkWell> {
    return this.http.put<WorkWell>(
      `${this.baseUrl}/api/WorkWell/UpdateIsPlayingWorkWell/${idWWS}`,
      isPlaying
    );
  }

  // Update isLocked status of a WorkWell entry in the API
  updateIsLockedFromApi(
    idWWS: number,
    isLocked: boolean
  ): Observable<WorkWell> {
    return this.http.put<WorkWell>(
      `${this.baseUrl}/api/WorkWell/UpdateIsLockedWorkWell/${idWWS}`,
      isLocked
    );
  }

  // Delete a WorkWell entry by ID from the API
  deleteWorkWellByIdFromApi(idWWS: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/WorkWell/DeleteWorkWellById/${idWWS}`
    );
  }
}
