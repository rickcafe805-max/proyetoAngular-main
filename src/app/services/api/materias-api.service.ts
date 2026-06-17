import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

export interface MateriaDto {
  nombre_materia: string;
  maestro: string;
  materia_color: number;
}

@Injectable({ providedIn: 'root' })
export class MateriasApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMaterias() {
    return this.http.get<any[]>(`${this.base}/cmaterias`);
  }

crearMateria(dto: MateriaDto) {
  console.log('Enviando a API:', JSON.stringify(dto));
  return this.http.post<any>(`${this.base}/cmaterias`, dto).pipe(
    catchError(err => {
      console.log('Error completo:', JSON.stringify(err.error));
      throw err;
    })
  );
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