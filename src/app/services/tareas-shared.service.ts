import { Injectable, signal, computed } from '@angular/core';

export interface Tarea {
  nombre: string;
  materia: string;
  fecha: string;
  dificultad: string;
  prioridad: string;
  tipo: string;
  completada: boolean;
}

@Injectable({ providedIn: 'root' })
export class TareasSharedService {
  tareas = signal<Tarea[]>([]);

  agregar(tarea: Tarea) {
    this.tareas.update(t => [...t, { ...tarea, completada: false }]);
  }

  eliminar(index: number) {
    this.tareas.update(t => t.filter((_, i) => i !== index));
  }

  completar(index: number) {
    this.tareas.update(t => t.map((tarea, i) =>
      i === index ? { ...tarea, completada: !tarea.completada } : tarea
    ));
  }

  get puntosDificultad(): Record<string, number> {
    return { 'Baja': 1, 'Media': 2, 'Alta': 3 };
  }

  get puntosPrioridad(): Record<string, number> {
    return { 'Baja': 0, 'Media': 1, 'Alta': 2 };
  }

  get nivelEstresTotal(): number {
    return this.tareas()
      .filter(t => !t.completada)
      .reduce((acc, t) => {
        const d = this.puntosDificultad[t.dificultad] || 0;
        const p = this.puntosPrioridad[t.prioridad] || 0;
        return acc + d + p;
      }, 0);
  }

  get nivelEstresLabel(): string {
    const n = this.nivelEstresTotal;
    if (n === 0) return 'Sin estrés';
    if (n <= 5) return 'Bajo';
    if (n <= 10) return 'Medio';
    if (n <= 20) return 'Alto';
    return 'Extremo';
  }

get porcentajeEstres(): number {
  const n = this.nivelEstresTotal;
  return Math.min((n / 50) * 100, 100);
}

  get tareasCompletadas(): number {
    return this.tareas().filter(t => t.completada).length;
  }

  get tareasTotal(): number {
    return this.tareas().length;
  }

  get porcentajeProgreso(): number {
    if (this.tareasTotal === 0) return 0;
    return Math.round((this.tareasCompletadas / this.tareasTotal) * 100);
  }

  get estadoActual(): { icono: string; label: string; color: string } {
    const n = this.nivelEstresTotal;
    if (n === 0) return { icono: '( ˘ᵕ˘ )', label: 'Tranquilo', color: '#A8D4F0' };
    if (n <= 5) return { icono: '( •ᴗ• )', label: 'Bien', color: '#A8D4C0' };
    if (n <= 10) return { icono: '( -_- )', label: 'Moderado', color: '#F9DFA0' };
    if (n <= 20) return { icono: '( >_< )', label: 'Estresado', color: '#F4C0A0' };
    return { icono: '( T_T )', label: 'Agobiado', color: '#F4A0A0' };
  }
}