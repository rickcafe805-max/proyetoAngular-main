import { NgIf, NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './calendario.html',
  styleUrls: ['./calendario.css'],
})
export class Calendario {
  @Input() visible: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() seleccionado = new EventEmitter<{ mes: string; anio: number; mesNum: number }>();

  cerrarCalendario() {
    this.cerrar.emit();
  }

seleccionar() {
  this.seleccionado.emit({
    mes: this.month_names[this.currentMonth()],
    anio: this.currentYear(),
    mesNum: this.currentMonth()
  });
  this.cerrar.emit();
}

  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  month_names = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  currentDate = new Date();
  currentMonth = signal(this.currentDate.getMonth());
  currentYear = signal(this.currentDate.getFullYear());
  showMonthSelector = false;

  get daysInMonth(): number[] {
    const daysCount = new Date(this.currentYear(), this.currentMonth() + 1, 0).getDate();
    const firstDay = new Date(this.currentYear(), this.currentMonth(), 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const days = [];
    for (let i = 0; i < offset; i++) days.push(0);
    for (let i = 1; i <= daysCount; i++) days.push(i);
    return days;
  }

  previousYear() { this.currentYear.update(y => y - 1); }
  nextYear() { this.currentYear.update(y => y + 1); }

  selectMonth(month: number) {
    this.currentMonth.set(month);
    this.showMonthSelector = false;
  }

  isToday(day: number): boolean {
    const today = new Date();
    return day === today.getDate() &&
      this.currentMonth() === today.getMonth() &&
      this.currentYear() === today.getFullYear();
  }
}