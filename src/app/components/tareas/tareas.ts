import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareasApiService, TareaApi, TareaDto } from '../../services/api/tareas-api.service';
import { MateriasApiService } from '../../services/api/materias-api.service';
import { TemaService } from '../../services/tema.service';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, FormsModule],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',
})
export class Tareas implements OnInit {
  constructor(
    private tareasApi: TareasApiService,
    private materiasApi: MateriasApiService,
    public temaService: TemaService
  ) {}

  tareas: TareaApi[] = [];
  materias: any[] = [];
  mostrarForm = false;
  cargando = false;

  nombre = '';
  materiaId: number | null = null;
  fecha = '';
  dificultad = '';
  prioridad = '';
  tipo = '';

  ngOnInit() {
    this.cargarTareas();
    this.cargarMaterias();
  }

  cargarTareas() {
    this.tareasApi.getAll().subscribe({
      next: (t) => this.tareas = t,
      error: () => {}
    });
  }

  cargarMaterias() {
    this.materiasApi.getMaterias().subscribe({
      next: (m) => this.materias = m,
      error: () => {}
    });
  }

  get estresGenerado(): number {
    const d = this.dificultad === 'Alta' ? 3 : this.dificultad === 'Media' ? 2 : 1;
    const p = this.prioridad === 'Alta' ? 2 : this.prioridad === 'Media' ? 1 : 0;
    return d + p;
  }

  agregarTarea() {
    if (!this.nombre || !this.dificultad || !this.prioridad) return;
    this.cargando = true;

    const dto: TareaDto = {
      nombre_tarea: this.nombre,
      dificultad: this.dificultad.toLowerCase() as 'baja' | 'media' | 'alta',
      prioridad: this.prioridad.toLowerCase() as 'baja' | 'media' | 'alta',
      fecha_entrega: this.fecha || undefined,
      id_materia: this.materiaId || undefined,
      tipo: this.tipo || undefined,
    };

    this.tareasApi.crear(dto).subscribe({
      next: () => {
        this.nombre = '';
        this.materiaId = null;
        this.fecha = '';
        this.dificultad = '';
        this.prioridad = '';
        this.tipo = '';
        this.mostrarForm = false;
        this.cargando = false;
        this.cargarTareas();
      },
      error: () => { this.cargando = false; }
    });
  }

  eliminarTarea(id: number) {
    this.tareasApi.eliminar(id).subscribe({
      next: () => this.cargarTareas()
    });
  }

  completarTarea(id: number) {
    this.tareasApi.completar(id).subscribe({
      next: () => this.cargarTareas()
    });
  }

  mostrarAjustes = false;
  abrirAjustes() { this.mostrarAjustes = !this.mostrarAjustes; }
}