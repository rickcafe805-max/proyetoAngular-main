import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TemaService {
  modoOscuro = signal<boolean>(
    localStorage.getItem('modoOscuro') === 'true'
  );

  constructor() {
    document.body.classList.toggle('dark-mode', this.modoOscuro());
  }

  toggle() {
    const nuevo = !this.modoOscuro();
    this.modoOscuro.set(nuevo);
    document.body.classList.toggle('dark-mode', nuevo);
    localStorage.setItem('modoOscuro', String(nuevo));
  }
}