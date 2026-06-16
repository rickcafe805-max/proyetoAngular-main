import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RegistroEstadoService } from '../../services/registro-estado.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
email: any;
  constructor(
    private estado: RegistroEstadoService,
    private router: Router
  ) {}

  nombre = '';
  username = '';
  correo = '';
  password = '';
  error = '';

  continuar() {
    if (!this.nombre || !this.username || !this.correo || !this.password) {
      this.error = 'Por favor completa todos los campos.';
      return;
    }
    this.estado.nombre = this.nombre;
    this.estado.username = this.username;
    this.estado.correo = this.correo;
    this.estado.password = this.password;
    this.router.navigate(['/cuestionario1']);
  }
}