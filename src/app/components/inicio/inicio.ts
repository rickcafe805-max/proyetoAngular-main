import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthApiService } from '../../services/api/auth-api.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  username = '';
  password = '';
  error = '';
  cargando = false;

  constructor(
    private authApi: AuthApiService,
    private router: Router
  ) {}
nombreUsuario = localStorage.getItem('nombre') || 'Usuario';
iniciarSesion() {
  
  if (!this.username || !this.password) {
    this.error = 'Por favor completa todos los campos.';
    return;
  }
  this.cargando = true;
  this.error = '';

  this.authApi.login({
    username: this.username,
    password: this.password
  }).subscribe({
    next: () => {
      this.cargando = false;
      this.router.navigate(['/principal']);
    },
    error: (err) => {
      this.cargando = false;
      this.error = err.error?.message || 'Usuario o contraseña incorrectos.';
    }
  });
  
}

}