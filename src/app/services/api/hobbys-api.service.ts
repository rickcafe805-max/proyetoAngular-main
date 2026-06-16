import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HobbysApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHobbys() {
    return this.http.get<any[]>(`${this.base}/g.hobbys`);
  }

  agregar(nombre_hobby: string) {
    return this.http.post<any>(`${this.base}/g.hobbys`, { nombre_hobby });
  }

  eliminar(id: number) {
    return this.http.delete<any>(`${this.base}/g.hobbys/${id}`);
  }
}