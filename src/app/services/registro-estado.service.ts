import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RegistroEstadoService {
  nombre = '';
  username = '';
  correo = '';
  password = '';
  edad = 0;
  carrera = '';
  semestre = '';
  apodo = '';
  hobbies: string[] = [];

  limpiar() {
    this.nombre = '';
    this.username = '';
    this.correo = '';
    this.password = '';
    this.edad = 0;
    this.carrera = '';
    this.semestre = '';
    this.apodo = '';
    this.hobbies = [];
  }
}