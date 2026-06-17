import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface RegisterDto {
  nombre: string;
  username: string;
  correo: string;
  password: string;
  edad: number;
  carrera: string;
  semestre: number;
  apodo?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

register(dto: RegisterDto) {
  console.log('Enviando registro:', dto); 
  return this.http.post<{ token: string }>(`${this.base}/auth/register`, dto);
}

  login(dto: LoginDto) {
    return this.http.post<{ token: string }>(`${this.base}/auth/login`, dto).pipe(
      tap(res => localStorage.setItem('token', res.token))
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}