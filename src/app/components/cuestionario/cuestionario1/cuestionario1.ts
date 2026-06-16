import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { RegistroEstadoService } from '../../../services/registro-estado.service';
import { HobbysApiService } from '../../../services/api/hobbys-api.service';

@Component({
  selector: 'app-cuestionario1',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor],
  templateUrl: './cuestionario1.html',
  styleUrl: './cuestionario1.css',
})
export class Cuestionario1 {
  constructor(
    private estado: RegistroEstadoService,
    private router: Router
  ) {}

  edad = '';
  carrera = '';
  semestre = '';
  estadoAnimo = 0;
  hobbiesSeleccionados: string[] = [];

  hobbies = [
    'Cantar', 'Escuchar Música', 'Leer',
    'Jugar videojuegos', 'Dormir',
    'Practicar deporte', 'Comer'
  ];

  nivelesAcademicos = [
    'Preparatoria', 'Universidad - 1er semestre',
    'Universidad - 2do semestre', 'Universidad - 3er semestre',
    'Universidad - 4to semestre', 'Universidad - 5to semestre',
    'Universidad - 6to semestre', 'Universidad - 7mo semestre',
    'Universidad - 8vo semestre', 'Posgrado'
  ];

 emociones = [
    { emoji: '>:C', valor: 1 },
    { emoji: ':C', valor: 2 },
    { emoji: ':|', valor: 3 },
    { emoji: ':)', valor: 4 },
    { emoji: ':D', valor: 5 },
  ];

  toggleHobby(hobby: string) {
    const idx = this.hobbiesSeleccionados.indexOf(hobby);
    if (idx > -1) {
      this.hobbiesSeleccionados.splice(idx, 1);
    } else {
      this.hobbiesSeleccionados.push(hobby);
    }
  }

  barraAncho(): string {
    return `${(this.estadoAnimo / 5) * 100}%`;
  }

  continuar() {
    this.estado.edad = parseInt(this.edad) || 0;
    this.estado.carrera = this.carrera;
    this.estado.semestre = parseInt(this.semestre) || 1;
    this.estado.hobbies = this.hobbiesSeleccionados;
    localStorage.setItem('hobbies', JSON.stringify(this.hobbiesSeleccionados));
    this.router.navigate(['/cuestionario2']);
  }
}