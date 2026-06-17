import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { TareasApiService, TareaApi } from '../../services/api/tareas-api.service';
import { TemaService } from '../../services/tema.service';

@Component({
  selector: 'app-calendario-page',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './calendario-page.html',
  styleUrl: './calendario-page.css',
})
export class CalendarioPage implements OnInit {
  constructor(
    private tareasApi: TareasApiService,
    public temaService: TemaService,
    private router: Router
  ) {}

  tareas: TareaApi[] = [];
  anioActual = new Date().getFullYear();

  meses = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ];

  diasSemana = ['L','M','X','J','V','S','D'];

  ngOnInit() {
    this.tareasApi.getAll().subscribe({
      next: (t) => this.tareas = t,
      error: () => {}
    });
  }

  getDias(mes: number): number[] {
    const daysCount = new Date(this.anioActual, mes + 1, 0).getDate();
    const firstDay = new Date(this.anioActual, mes, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const days = [];
    for (let i = 0; i < offset; i++) days.push(0);
    for (let i = 1; i <= daysCount; i++) days.push(i);
    return days;
  }

  esHoy(dia: number, mes: number): boolean {
    const hoy = new Date();
    return dia === hoy.getDate() && mes === hoy.getMonth() && this.anioActual === hoy.getFullYear();
  }

getTareasDelDia(dia: number, mes: number): TareaApi[] {
  const fechaStr = `${this.anioActual}-${String(mes + 1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
  return this.tareas.filter(t => t.fecha === fechaStr);
}

  tieneTarea(dia: number, mes: number): boolean {
    return this.getTareasDelDia(dia, mes).length > 0;
  }

  tooltipTarea(dia: number, mes: number): string {
    return this.getTareasDelDia(dia, mes)
      .map(t => `${t.nombre_tarea}${t.materia ? ' - ' + t.materia.nombre_materia : ''}`)
      .join('\n');
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