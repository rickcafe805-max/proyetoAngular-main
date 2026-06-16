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
    if (!this.nombre.trim() || !this.username.trim() ||
          !this.correo.trim() || !this.password.trim()) {
      this.error = 'Por favor completa todos los campos.';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    this.error = '';
    this.estado.nombre = this.nombre.trim();
    this.estado.username = this.username.trim();
    this.estado.correo = this.correo.trim();
    this.estado.password = this.password;
    this.router.navigate(['/cuestionario1']);
  }
}