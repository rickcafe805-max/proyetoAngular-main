import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ColorApi {
  id_color: number;
  nombre_color: string;
  hex: string;
}

@Injectable({ providedIn: 'root' })
export class ColoresApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getColores() {
    return this.http.get<ColorApi[]>(`${this.base}/d.colores`);
  }
}