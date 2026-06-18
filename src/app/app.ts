import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Principal } from './components/principal/principal';
import { Calendario } from './components/calendario/calendario';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  //imports: [RouterOutlet, Principal, Calendario],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('proyecto_analisis');

  private http = inject(HttpClient);

  constructor() {
    // Ping para despertar la API
    this.http.get('https://api-def.onrender.com/auth/login', {
      observe: 'response'
    }).subscribe({ error: () => {} });
  }
}
