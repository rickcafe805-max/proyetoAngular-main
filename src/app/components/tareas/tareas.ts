import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
    public temaService: TemaService,
    private router: Router 
  ) {}

  tareas: TareaApi[] = [];
  materias: any[] = [];
  mostrarForm = false;
  mostrarAgregarMateria = false;
  cargando = false;

  // Tarea
  nombre = '';
  materiaId: number | null = null;
  fecha = '';
  dificultad = '';
  prioridad = '';
  tipo = '';

  // Nueva materia
  nuevaMateriaNombre = '';
  nuevaMateriaDocente = '';
  nuevaMateriaColor = 1;
  errorMateria = '';

coloresDisponibles = [
  { id_color: 1, hex: '#F4A0B5' },
  { id_color: 2, hex: '#F9C5D1' },
  { id_color: 3, hex: '#A8C8F0' },
  { id_color: 4, hex: '#A0D4F5' },
  { id_color: 5, hex: '#F5ECD7' },
  { id_color: 6, hex: '#F9E4B7' },
  { id_color: 7, hex: '#F4C5A0' },
  { id_color: 8, hex: '#D4A0C8' },
];

cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('nombre');
  localStorage.removeItem('username');
  this.router.navigate(['/presentacion']);
}

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
      next: (m) => {
        this.materias = m;
        console.log('Materias:', m);
      },
      error: () => this.materias = []
    });
  }

  get estresGenerado(): number {
    const d = this.dificultad === 'Alta' ? 3 : this.dificultad === 'Media' ? 2 : 1;
    const p = this.prioridad === 'Alta' ? 3 : this.prioridad === 'Media' ? 2 : 1;
    return d + p;
  }

  agregarTarea() {
    if (!this.nombre || !this.dificultad || !this.prioridad || !this.fecha) {
      alert('Completa nombre, dificultad, prioridad y fecha.');
      return;
    }
    if (!this.materiaId) {
      alert('Selecciona una materia.');
      return;
    }
    this.cargando = true;

    const dificultadNum = this.dificultad === 'Alta' ? 3 :
                          this.dificultad === 'Media' ? 2 : 1;
    const prioridadNum = this.prioridad === 'Alta' ? 3 :
                         this.prioridad === 'Media' ? 2 : 1;

    const dto = {
      nombre_tarea: this.nombre,
      dificultad: dificultadNum,
      prioridad: prioridadNum,
      fecha: this.fecha,
      tarea_materia: this.materiaId
    };

    console.log('Creando tarea:', JSON.stringify(dto));

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
      error: (err) => {
        console.log('Error tarea:', err.error);
        this.cargando = false;
      }
    });
  }

  guardarMateria() {
    if (!this.nuevaMateriaNombre || !this.nuevaMateriaDocente) {
      this.errorMateria = 'Completa nombre y docente.';
      return;
    }
    this.errorMateria = '';

    const dto = {
      nombre_materia: this.nuevaMateriaNombre,
      maestro: this.nuevaMateriaDocente,
      materia_color: this.nuevaMateriaColor
    };

    console.log('DTO MATERIA:', JSON.stringify(dto));

    this.materiasApi.crearMateria(dto).subscribe({
      next: () => {
        this.nuevaMateriaNombre = '';
        this.nuevaMateriaDocente = '';
        this.nuevaMateriaColor = 1;
        this.mostrarAgregarMateria = false;
        this.cargarMaterias();
      },
      error: (err) => {
        console.log('ERROR COMPLETO MATERIA:', err);
        console.log('ERROR BODY MATERIA:', err.error);
        this.errorMateria = err.error?.message || err.error?.detail || 'Error al guardar materia.';
      }
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