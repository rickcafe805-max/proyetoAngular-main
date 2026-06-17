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
  semestre: string;
  apodo: string;
  hobbys: string[];
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user: {
    id_usuario: number;
    username: string;
    nombre: string;
    correo: string;
    role: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(dto: RegisterDto) {
    return this.http.post<AuthResponse>(`${this.base}/auth/register`, dto);
  }

  login(dto: LoginDto) {
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, dto).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('username', res.user.username);
        localStorage.setItem('nombre', res.user.nombre);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('nombre');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}