import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface TareaDto {
  nombre_tarea: string;
  id_materia?: number;
  fecha_entrega?: string;
  dificultad: 'baja' | 'media' | 'alta';
  prioridad: 'baja' | 'media' | 'alta';
  tipo?: string;
}

export interface TareaApi {
  id_tarea: number;
  nombre_tarea: string;
  fecha_entrega?: string;
  dificultad: string;
  prioridad: string;
  tipo?: string;
  finalizada: boolean;
  puntos_estres: number;
  materia?: { id_materia: number; nombre_materia: string };
}

@Injectable({ providedIn: 'root' })
export class TareasApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<TareaApi[]>(`${this.base}/f.tareas`);
  }

  getOne(id: number) {
    return this.http.get<TareaApi>(`${this.base}/f.tareas/${id}`);
  }

  crear(dto: TareaDto) {
    return this.http.post<TareaApi>(`${this.base}/f.tareas`, dto);
  }

  actualizar(id: number, dto: Partial<TareaDto>) {
    return this.http.patch<TareaApi>(`${this.base}/f.tareas/${id}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete<any>(`${this.base}/f.tareas/${id}`);
  }

  completar(id: number) {
    return this.http.patch<any>(`${this.base}/f.tareas/${id}/completar`, {});
  }
}