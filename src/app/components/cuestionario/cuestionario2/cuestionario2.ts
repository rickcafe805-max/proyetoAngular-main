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
    private coloresApi: ColoresApiService,
    private router: Router
  ) {}

  nombreMateria = '';
  docente = '';
  colorSeleccionado: ColorApi | null = null;
  colores: ColorApi[] = [];
  materias: { nombre: string; docente: string; color: ColorApi }[] = [];
  cargandoColores = true;

  ngOnInit() {
    this.coloresApi.getColores().subscribe({
      next: (c) => {
        this.colores = c;
        this.cargandoColores = false;
      },
      error: () => {
        // Si falla la API usa colores locales de respaldo
        this.colores = [
          { id_color: 1, nombre_color: 'Rosa', hex: '#F4A0B5' },
          { id_color: 2, nombre_color: 'Azul', hex: '#A8C8F0' },
          { id_color: 3, nombre_color: 'Verde', hex: '#A8D4A8' },
          { id_color: 4, nombre_color: 'Amarillo', hex: '#F9DFA0' },
          { id_color: 5, nombre_color: 'Lila', hex: '#D4A0C8' },
          { id_color: 6, nombre_color: 'Durazno', hex: '#F4C5A0' },
          { id_color: 7, nombre_color: 'Celeste', hex: '#A0D4E8' },
          { id_color: 8, nombre_color: 'Rojo', hex: '#D45060' },
        ];
        this.cargandoColores = false;
      }
    });
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