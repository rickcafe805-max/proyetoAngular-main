import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RegistroEstadoService {
  nombre = '';
  username = '';
  correo = '';
  password = '';
  edad = 0;
  carrera = '';
  semestre = 0;
  apodo = '';
  hobbies: string[] = [];
  colorAcompanante = 1;

  limpiar() {
    this.nombre = '';
    this.username = '';
    this.correo = '';
    this.password = '';
    this.edad = 0;
    this.carrera = '';
    this.semestre = 0;
    this.apodo = '';
    this.hobbies = [];
    this.colorAcompanante = 1;
  }
}