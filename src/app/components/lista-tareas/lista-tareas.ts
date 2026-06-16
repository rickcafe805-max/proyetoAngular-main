import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lista-tareas',
  standalone : true,
  imports: [NgIf],
  templateUrl: './lista-tareas.html',
  styleUrls: ['./lista-tareas.css'],
})
export class ListaTareas {
  @Input() visible: boolean = false;  // Para controlar desde afuera
  @Output() cerrar = new EventEmitter<void>();  // Para notificar al padre

  cerrarLista() {
    this.cerrar.emit();  // Avisa al componente padre
  }
}
