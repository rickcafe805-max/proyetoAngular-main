import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { AuthApiService } from '../../../services/api/auth-api.service';
import { MateriasApiService } from '../../../services/api/materias-api.service';
import { HobbysApiService } from '../../../services/api/hobbys-api.service';
import { RegistroEstadoService } from '../../../services/registro-estado.service';

@Component({
  selector: 'app-cuestionario4',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './cuestionario4.html',
  styleUrl: './cuestionario4.css',
})
export class Cuestionario4 implements OnDestroy {
  slideActual = 0;
  cargando = false;
  error = '';

  constructor(
    private authApi: AuthApiService,
    private materiasApi: MateriasApiService,
    private hobbysApi: HobbysApiService,
    private estado: RegistroEstadoService,
    private router: Router
  ) {}

  slides = [
    {
      icono: '⚙️',
      titulo: 'Sistema de estrés por puntos',
      descripcion: 'Cada tarea suma puntos de estrés según su dificultad y prioridad. Al completarlas, los puntos se reducen.',
      items: [
        'Dificultad Alta (3 pts) + Prioridad Alta (2 pts) = 5 puntos de estrés',
        'Completa tareas para reducir tu nivel de estrés',
        'Tu avatar cambia según tu nivel actual'
      ]
    },
    {
      icono: '🔥',
      titulo: 'Sistema de rachas',
      descripcion: 'Usa la app consecutivamente para ganar rachas y desbloquear beneficios especiales.',
      items: [
        '3 días seguidos: Primera racha',
        '7 días seguidos: Bonus de estrés -5 puntos',
        '15 días seguidos: Desbloqueas funciones premium'
      ]
    },
    {
      icono: '🤖',
      titulo: 'Asistente',
      descripcion: 'Tu asistente personal te ayudará a mantener el equilibrio durante todo el día.',
      items: [
        'Por la mañana: Pronóstico de estrés del día',
        'Durante el día: Seguimiento de tus tareas',
        'Por la noche: Reflexión sobre tu día'
      ]
    },
    {
      icono: '☕',
      titulo: 'Microdescansos',
      descripcion: 'Cuando detectemos mucho tiempo sin interacción o estrés alto, te sugeriremos pausas.',
      items: [
        'Respiración guiada de 1 minuto',
        'Reduce instantáneamente tu estrés',
        'Activa el "Modo Solo lo urgente" si es necesario'
      ]
    }
  ];

  siguiente() {
    if (this.slideActual < this.slides.length - 1) {
      this.slideActual++;
    } else {
      this.registrar();
    }
  }

registrar() {
  this.cargando = true;
  this.error = '';

  const body = {
    nombre: this.estado.nombre,
    username: this.estado.username,
    correo: this.estado.correo,
    password: this.estado.password,
    edad: this.estado.edad || 18,
    carrera: this.estado.carrera || 'No especificada',
    semestre: this.estado.semestre || 1,
    apodo: this.estado.apodo || this.estado.nombre,
  };

  console.log('Body del registro:', body); // ver en consola qué se envía

  this.authApi.register(body).subscribe({
    next: (res) => {
      console.log('Registro exitoso:', res);
      localStorage.setItem('token', res.token);
      this.crearMateriasYHobbies();
    },
    error: (err) => {
      console.log('Error registro:', err.error);
      this.cargando = false;
      this.error = JSON.stringify(err.error);
    }
  });
}

  private crearMateriasYHobbies() {
    const materiasTemp = JSON.parse(localStorage.getItem('materiasTemp') || '[]');
    const hobbies: string[] = this.estado.hobbies;

    // Crear materias
    const peticionesM = materiasTemp.map((m: any) =>
      this.materiasApi.crearMateria({
        nombre_materia: m.nombre,
        maestro: m.docente,
        id_color: m.color.id_color
      }).subscribe()
    );

    // Crear hobbies
    hobbies.forEach(h =>
      this.hobbysApi.agregar(h).subscribe()
    );

    // Limpiar temp
    localStorage.removeItem('materiasTemp');
    this.estado.limpiar();

    this.cargando = false;
    this.router.navigate(['/principal']);
  }

  ngOnDestroy() {}
}