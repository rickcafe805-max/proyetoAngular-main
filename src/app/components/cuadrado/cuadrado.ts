import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cuadrado',
  standalone: true,
  imports: [NgIf],
  templateUrl: './cuadrado.html',
  styleUrls: ['./cuadrado.css'],
})
export class Cuadrado {
  @Input() visible: boolean = false;  // Para controlar desde afuera
  @Output() cerrar = new EventEmitter<void>();  // Para notificar al padre
  
  mensaje: string = "Soy un cuadrado independiente";
  
  miLogicaPropia() {
    console.log("Lógica del cuadrado ejecutándose");
    this.mensaje = "¡El cuadrado fue clickeado!";
  }
  
  cerrarCuadrado() {
    this.cerrar.emit();  // Avisa al componente padre
  }
}
