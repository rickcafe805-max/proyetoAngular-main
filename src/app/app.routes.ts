import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Presentacion } from './components/presentacion/presentacion';
import { Inicio } from './components/inicio/inicio';
import { Registro } from './components/registro/registro';
import { Cuestionario1 } from './components/cuestionario/cuestionario1/cuestionario1';
import { Cuestionario2 } from './components/cuestionario/cuestionario2/cuestionario2';
import { Cuestionario3 } from './components/cuestionario/cuestionario3/cuestionario3';
import { Cuestionario4 } from './components/cuestionario/cuestionario4/cuestionario4';
import { Principal } from './components/principal/principal';
import { Tareas } from './components/tareas/tareas';
import { CalendarioPage } from './components/calendario-page/calendario-page';
import { Journal } from './components/journal/journal';

export const routes: Routes = [
  { path: '', component: Presentacion },
  { path: 'presentacion', component: Presentacion },
  { path: 'inicio', component: Inicio },
  { path: 'registro', component: Registro },
  { path: 'cuestionario1', component: Cuestionario1 },
  { path: 'cuestionario2', component: Cuestionario2 },
  { path: 'cuestionario3', component: Cuestionario3 },
  { path: 'cuestionario4', component: Cuestionario4 },
  { path: 'principal', component: Principal, canActivate: [authGuard] },
  { path: 'tareas', component: Tareas, canActivate: [authGuard] },
  { path: 'calendario', component: CalendarioPage, canActivate: [authGuard] },
  { path: 'journal', component: Journal, canActivate: [authGuard] },
];