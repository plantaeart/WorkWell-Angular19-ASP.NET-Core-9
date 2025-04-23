// src/app/core/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { WorkWell } from '../../models/workWell.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkWellApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllWorkWellFromApi(): Observable<WorkWell[]> {
    return this.http.get<WorkWell[]>(
      `${this.baseUrl}/api/WorkWell/GetAllWorkWell`
    );
  }

  getWorkWellByIdFromApi(idWWS: number): Observable<WorkWell> {
    return this.http.get<WorkWell>(
      `${this.baseUrl}/api/WorkWell/GetWorkWellById/${idWWS}`
    );
  }

  createWorkWellFromApi(workWell: WorkWell): Observable<WorkWell> {
    return this.http.post<WorkWell>(
      `${this.baseUrl}/api/WorkWell/CreateWorkWell`,
      workWell
    );
  }

  deleteWorkWellByIdFromApi(idWWS: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/api/WorkWell/DeleteWorkWellById/${idWWS}`
    );
  }
}
