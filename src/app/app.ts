import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Principal } from './components/principal/principal';
import { Calendario } from './components/calendario/calendario';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  //imports: [RouterOutlet, Principal, Calendario],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('proyecto_analisis');
}
