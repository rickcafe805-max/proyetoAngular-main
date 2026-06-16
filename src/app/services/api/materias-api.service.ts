import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface MateriaDto {
  nombre_materia: string;
  maestro: string;
  id_color: number;
}

@Injectable({ providedIn: 'root' })
export class MateriasApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMaterias() {
    return this.http.get<any[]>(`${this.base}/cmaterias`);
  }

  crearMateria(dto: MateriaDto) {
    return this.http.post<any>(`${this.base}/cmaterias`, dto);
  }

  getMateria(id: number) {
    return this.http.get<any>(`${this.base}/cmaterias/${id}`);
  }

  actualizarMateria(id: number, dto: Partial<MateriaDto>) {
    return this.http.patch<any>(`${this.base}/cmaterias/${id}`, dto);
  }

  eliminarMateria(id: number) {
    return this.http.delete<any>(`${this.base}/cmaterias/${id}`);
  }
}