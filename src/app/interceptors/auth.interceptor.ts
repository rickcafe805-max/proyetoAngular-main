import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Solo agregar token si existe Y no es una ruta pública
  const rutasPublicas = ['/auth/register', '/auth/login'];
  const esPublica = rutasPublicas.some(r => req.url.includes(r));

  const authReq = token && !esPublica
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !esPublica) {
        localStorage.removeItem('token');
        router.navigate(['/inicio']);
      }
      return throwError(() => error);
    })
  );
};