import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgIf, NgFor, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TareasApiService, TareaApi } from '../../services/api/tareas-api.service';
import { PerfilApiService } from '../../services/api/perfil-api.service';
import { TemaService } from '../../services/tema.service';

export interface EntradaJournal {
  fecha: string;
  fechaFormateada: string;
  contenido: string;
  nivelEstres: number;
  tareasCompletadas: { nombre: string; materia: string; fecha: string }[];
}

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, FormsModule, TitleCasePipe],
  templateUrl: './journal.html',
  styleUrl: './journal.css',
})
export class Journal implements OnInit {
  constructor(
    private tareasApi: TareasApiService,
    private perfilApi: PerfilApiService,
    public temaService: TemaService,
    private router: Router
  ) {}

  fechaHoy = new Date();
  fechaKey = this.getFechaKey(new Date());
  contenido = '';
  nivelEstresHoy = 3;
  guardado = false;
  viendoHistorial = false;
  entradas: EntradaJournal[] = [];
  tareas: TareaApi[] = [];

  ngOnInit() {
    const guardadoHoy = localStorage.getItem(`journal_${this.fechaKey}`);
    if (guardadoHoy) {
      const entrada: EntradaJournal = JSON.parse(guardadoHoy);
      this.contenido = entrada.contenido;
      this.nivelEstresHoy = entrada.nivelEstres || 3;
    }
    this.cargarEntradas();
    this.cargarTareas();
  }

  get usuarioKey(): string {
    return localStorage.getItem('username') || 'anonimo';
  }

  getFechaKey(fecha: Date): string {
    return `${this.usuarioKey}_${fecha.toISOString().split('T')[0]}`;
  }

  get indiceKey(): string {
    return `journal_indice_${this.usuarioKey}`;
  }

  get fechaFormateada(): string {
    return this.fechaHoy.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  cargarTareas() {
    this.tareasApi.getAll().subscribe({
      next: (t) => this.tareas = t,
      error: () => {}
    });
  }

  get tareasCompletadasHoy(): TareaApi[] {
    return this.tareas.filter(t => t.finalizada);
  }

  guardarEntrada() {
    const entrada: EntradaJournal = {
      fecha: this.fechaKey,
      fechaFormateada: this.fechaFormateada,
      contenido: this.contenido,
      nivelEstres: this.nivelEstresHoy,
      tareasCompletadas: this.tareasCompletadasHoy.map(t => ({
        nombre: t.nombre_tarea,
        materia: t.materia?.nombre_materia || '',
        fecha: t.fecha || ''
      }))
    };

    localStorage.setItem(`journal_${this.fechaKey}`, JSON.stringify(entrada));

    const indice: string[] = JSON.parse(
      localStorage.getItem(this.indiceKey) || '[]'
    );
    if (!indice.includes(this.fechaKey)) {
      indice.push(this.fechaKey);
      localStorage.setItem(this.indiceKey, JSON.stringify(indice));
    }

    this.perfilApi.registrarDiario({
      nivel_estres: this.nivelEstresHoy,
      que_ayudo: this.contenido.substring(0, 200)
    }).subscribe({
      next: () => console.log('Diario guardado en API'),
      error: (err) => console.log('Error guardando diario:', err.error)
    });

    this.guardado = true;
    setTimeout(() => this.guardado = false, 3000);
    this.cargarEntradas();
  }

  cargarEntradas() {
    const indice: string[] = JSON.parse(
      localStorage.getItem(this.indiceKey) || '[]'
    );
    this.entradas = indice
      .map(key => {
        const raw = localStorage.getItem(`journal_${key}`);
        return raw ? JSON.parse(raw) as EntradaJournal : null;
      })
      .filter(e => e !== null) as EntradaJournal[];
    this.entradas.sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  mostrarAjustes = false;
  abrirAjustes() { this.mostrarAjustes = !this.mostrarAjustes; }

  cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('nombre');
  localStorage.removeItem('username');
  this.router.navigate(['/presentacion']);
}
}