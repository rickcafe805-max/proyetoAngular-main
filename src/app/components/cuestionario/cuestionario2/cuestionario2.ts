import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { RegistroEstadoService } from '../../../services/registro-estado.service';
import { ColoresApiService, ColorApi } from '../../../services/api/colores-api.service';

@Component({
  selector: 'app-cuestionario2',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, NgIf],
  templateUrl: './cuestionario2.html',
  styleUrl: './cuestionario2.css',
})
export class Cuestionario2 implements OnInit {
constructor(
  private estado: RegistroEstadoService,
  private router: Router
) {}

  nombreMateria = '';
  docente = '';
  colorSeleccionado: ColorApi | null = null;
  colores: ColorApi[] = [];
  materias: { nombre: string; docente: string; color: ColorApi }[] = [];
  cargandoColores = true;

ngOnInit() {
  // Usar colores locales — no necesitan token
this.colores = [
  { id_color: 1, nombre_color: 'Rosa', hex: '#F4A0B5' },
  { id_color: 2, nombre_color: 'Rosa suave', hex: '#F9C5D1' },
  { id_color: 3, nombre_color: 'Azul', hex: '#A8C8F0' },
  { id_color: 4, nombre_color: 'Celeste', hex: '#A0D4F5' },
  { id_color: 5, nombre_color: 'Crema', hex: '#F5ECD7' },
  { id_color: 6, nombre_color: 'Amarillo', hex: '#F9E4B7' },
  { id_color: 7, nombre_color: 'Durazno', hex: '#F4C5A0' },
  { id_color: 8, nombre_color: 'Lila', hex: '#D4A0C8' },
];
  this.cargandoColores = false;
}

  agregarMateria() {
    if (!this.nombreMateria || !this.docente || !this.colorSeleccionado) return;
    this.materias.push({
      nombre: this.nombreMateria,
      docente: this.docente,
      color: this.colorSeleccionado
    });
    this.nombreMateria = '';
    this.docente = '';
    this.colorSeleccionado = null;
  }

  eliminarMateria(index: number) {
    this.materias.splice(index, 1);
  }

  continuar() {
    // Guardamos las materias temporalmente para crearlas después del registro
    localStorage.setItem('materiasTemp', JSON.stringify(this.materias));
    this.router.navigate(['/cuestionario3']);
  }
}