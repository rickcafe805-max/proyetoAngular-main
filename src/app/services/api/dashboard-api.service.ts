import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboard() {
    return this.http.get<any>(`${this.base}/dashboard`);
  }

  getResumenNocturno() {
    return this.http.get<any>(`${this.base}/dashboard/resumen-nocturno`);
  }
}