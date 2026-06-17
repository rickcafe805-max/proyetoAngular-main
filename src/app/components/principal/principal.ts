import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaTareas } from '../lista-tareas/lista-tareas';
import { Calendario } from '../calendario/calendario';
import { TemaService } from '../../services/tema.service';
import { DashboardApiService } from '../../services/api/dashboard-api.service';
import { PerfilApiService } from '../../services/api/perfil-api.service';
import { TareasApiService, TareaApi } from '../../services/api/tareas-api.service';
import { HobbysApiService } from '../../services/api/hobbys-api.service';


@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, FormsModule, ListaTareas, Calendario],
  templateUrl: './principal.html',
  styleUrls: ['./principal.css'],
})
export class Principal implements OnInit, OnDestroy {

  constructor(
    public temaService: TemaService,
    private dashboardApi: DashboardApiService,
    private perfilApi: PerfilApiService,
    private tareasApi: TareasApiService,
    private cdr: ChangeDetectorRef,
    private hobbysApi: HobbysApiService
  ) {}

  // DATOS DEL DASHBOARD
  dashboard: any = null;
  cargando = true;

  // DATOS CALCULADOS
  nombreUsuario = '';
  nivelEstresTotal = 0;
  nivelEstresLabel = 'Sin estrés';
  porcentajeEstres = 0;
  tareasCompletadas = 0;
  tareasTotal = 0;
  porcentajeProgreso = 0;
  estadoActual = { icono: '( ˘ᵕ˘ )', label: 'Tranquilo', color: '#A8D4F0' };
  hobbies: string[] = [];
recomendacion = '';
  avatarImg = localStorage.getItem('avatarImg') || '';
  tareas: TareaApi[] = [];

  get gaugeColor(): string {
    const label = this.nivelEstresLabel;
    if (label === 'Sin estrés') return '#47a6e0';
    if (label === 'Bajo') return '#67ce54';
    if (label === 'Medio') return '#F5C842';
    if (label === 'Alto') return '#F4A060';
    return '#F44040';
  }

  get gaugeOffset(): number {
    return 157 - (157 * Math.min(this.porcentajeEstres, 100) / 100);
  }

  get saludo(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }

ngOnInit() {
  this.cargarDashboard();
  this.cargarTareas();
  this.cargarHobbies();
}

cargarHobbies() {
  this.hobbysApi.getHobbys().subscribe({
    next: (h) => {
      this.hobbies = h.map((hobby: any) => hobby.nombre_hobby);
      this.generarRecomendacion();
    },
    error: () => {
      // fallback a localStorage
      this.hobbies = JSON.parse(localStorage.getItem('hobbies') || '[]');
      this.generarRecomendacion();
    }
  });
}

generarRecomendacion() {
  if (this.hobbies.length === 0) {
    this.recomendacion = 'Tómate un descanso hoy, te lo mereces.';
    return;
  }
  const hobby = this.hobbies[Math.floor(Math.random() * this.hobbies.length)];
  const mensajes = [
    `No olvides hacer tu ${hobby} favorito hoy.`,
    `Un momento de ${hobby} puede aliviar tu estrés.`,
    `¿Ya dedicaste tiempo a ${hobby} hoy?`,
    `Recuerda que ${hobby} te ayuda a recargar energía.`
  ];
  this.recomendacion = mensajes[Math.floor(Math.random() * mensajes.length)];
}

  cargarDashboard() {
    this.cargando = true;
    this.dashboardApi.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.procesarDashboard(data);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  procesarDashboard(data: any) {
  this.nombreUsuario = data.perfil?.apodo || data.perfil?.nombre || 'Usuario';
  this.nivelEstresTotal = data.perfil?.puntosT_estres || 0;
    this.recomendacion = data.recomendacion || 'Tómate un descanso hoy.';

  if (data.recomendacion) {
    this.recomendacion = data.recomendacion;
  }

    // Nivel de estrés
    const pts = this.nivelEstresTotal;
    if (pts === 0) {
      this.nivelEstresLabel = 'Sin estrés';
      this.estadoActual = { icono: '( ˘ᵕ˘ )', label: 'Tranquilo', color: '#A8D4F0' };
    } else if (pts <= 5) {
      this.nivelEstresLabel = 'Bajo';
      this.estadoActual = { icono: '( •ᴗ• )', label: 'Bien', color: '#A8D4C0' };
    } else if (pts <= 10) {
      this.nivelEstresLabel = 'Medio';
      this.estadoActual = { icono: '( -_- )', label: 'Moderado', color: '#F9DFA0' };
    } else if (pts <= 20) {
      this.nivelEstresLabel = 'Alto';
      this.estadoActual = { icono: '( >_< )', label: 'Estresado', color: '#F4C0A0' };
    } else {
      this.nivelEstresLabel = 'Extremo';
      this.estadoActual = { icono: '( T_T )', label: 'Agobiado', color: '#F4A0A0' };
    }

    this.porcentajeEstres = Math.min((pts / 50) * 100, 100);

    // Progreso de tareas
    const tareasPendientes: any[] = data.tareasPendientes || [];
    const tareasFinalizadas: any[] = data.tareasFinalizadas || [];
    this.tareasCompletadas = tareasFinalizadas.length;
    this.tareasTotal = tareasPendientes.length + tareasFinalizadas.length;
    this.porcentajeProgreso = this.tareasTotal > 0
      ? Math.round((this.tareasCompletadas / this.tareasTotal) * 100)
      : 0;

      
  }

  cargarTareas() {
    this.tareasApi.getAll().subscribe({
      next: (t) => {
        this.tareas = t;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  completarTarea(id: number) {
    this.tareasApi.completar(id).subscribe({
      next: () => {
        this.cargarTareas();
        this.cargarDashboard();
      }
    });
  }

  eliminarTarea(id: number) {
    this.tareasApi.eliminar(id).subscribe({
      next: () => {
        this.cargarTareas();
        this.cargarDashboard();
      }
    });
  }

  // TO DO LIST RÁPIDO
  mostrarCuadrado = false;
  nuevaTarea = '';

  abrirCuadrado() { this.mostrarCuadrado = true; }
  cerrarCuadrado() { this.mostrarCuadrado = false; }

agregarTareaRapida() {
  if (!this.nuevaTarea.trim()) return;
  const dto: any = {
    nombre_tarea: this.nuevaTarea.trim(),
    dificultad: 1,
    prioridad: 0,
  };
  this.tareasApi.crear(dto).subscribe({
    next: () => {
      this.nuevaTarea = '';
      this.mostrarCuadrado = false;
      this.cargarTareas();
      this.cargarDashboard();
    },
    error: (err) => console.log('Error tarea rápida:', err.error)
  });
}

  // LISTA TAREAS SIDEBAR
  mostrarLista = false;
  abrirLista() { this.mostrarLista = true; }
  cerrarLista() { this.mostrarLista = false; }

  // CALENDARIO
  mostrarCalendario = false;
  mesSeleccionado = '';
  anioSeleccionado = 0;
  mesNumSeleccionado = 0;
  diasMesSeleccionado: number[] = [];

  abrirCalendario() { this.mostrarCalendario = true; }
  cerrarCalendario() { this.mostrarCalendario = false; }

  onCalendarioSeleccionado(evento: { mes: string; anio: number; mesNum: number }) {
    this.mesSeleccionado = evento.mes;
    this.anioSeleccionado = evento.anio;
    this.mesNumSeleccionado = evento.mesNum;
    this.diasMesSeleccionado = this.calcularDias(evento.mesNum, evento.anio);
    this.mostrarCalendario = false;
  }

  calcularDias(mes: number, anio: number): number[] {
    const daysCount = new Date(anio, mes + 1, 0).getDate();
    const firstDay = new Date(anio, mes, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const days = [];
    for (let i = 0; i < offset; i++) days.push(0);
    for (let i = 1; i <= daysCount; i++) days.push(i);
    return days;
  }

  esHoy(day: number): boolean {
    const today = new Date();
    return day === today.getDate() &&
      this.mesNumSeleccionado === today.getMonth() &&
      this.anioSeleccionado === today.getFullYear();
  }

tieneTareaEnDia(dia: number): boolean {
  if (!this.mesSeleccionado) return false;
  const fechaStr = `${this.anioSeleccionado}-${String(this.mesNumSeleccionado + 1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
  return this.tareas.some(t => t.fecha === fechaStr);
}

tooltipTareasDia(dia: number): string {
  if (!this.mesSeleccionado) return '';
  const fechaStr = `${this.anioSeleccionado}-${String(this.mesNumSeleccionado + 1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
  return this.tareas
    .filter(t => t.fecha === fechaStr)
    .map(t => t.nombre_tarea)
    .join(', ');
}

  // MICRODESCANSO
  mostrarTimer = false;
  timerSegundos = 15 * 60;
  timerInterval: any = null;
  bloqueado = false;

  get timerFormato(): string {
    const m = Math.floor(this.timerSegundos / 60);
    const s = this.timerSegundos % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  iniciarMicrodescanso() {
    this.perfilApi.microdescanso().subscribe();
    this.mostrarTimer = true;
    this.bloqueado = true;
    this.timerSegundos = 15 * 60;
    this.timerInterval = setInterval(() => {
      this.timerSegundos--;
      this.cdr.detectChanges();
      if (this.timerSegundos <= 0) {
        clearInterval(this.timerInterval);
        this.mostrarTimer = false;
        this.bloqueado = false;
        this.cargarDashboard();
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  // AJUSTES
  mostrarAjustes = false;
  abrirAjustes() { this.mostrarAjustes = !this.mostrarAjustes; }
}