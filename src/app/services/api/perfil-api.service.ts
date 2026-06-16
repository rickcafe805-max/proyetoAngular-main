import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PerfilApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMiPerfil() {
    return this.http.get<any>(`${this.base}/e.perfil`);
  }

  actualizarPerfil(datos: any) {
    return this.http.patch<any>(`${this.base}/e.perfil`, datos);
  }

  getPronostico() {
    return this.http.get<any>(`${this.base}/e.perfil/pronostico`);
  }

  microdescanso() {
    return this.http.post<any>(`${this.base}/e.perfil/microdescanso`, {});
  }

  registrarDiario(datos: { nivel_estres: number; que_ayudo?: string; que_empeoro?: string }) {
    return this.http.post<any>(`${this.base}/e.perfil/diario`, datos);
  }

  actualizarRacha() {
    return this.http.patch<any>(`${this.base}/e.perfil/racha`, {});
  }
}