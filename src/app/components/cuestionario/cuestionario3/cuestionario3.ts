import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { RegistroEstadoService } from '../../../services/registro-estado.service';

@Component({
  selector: 'app-cuestionario3',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './cuestionario3.html',
  styleUrl: './cuestionario3.css',
})
export class Cuestionario3 {
  constructor(
    private estado: RegistroEstadoService,
    private router: Router
  ) {}

  avatarSeleccionado = '';

  avatares = [
    { id: 'gato',   nombre: 'Gato',   img: 'avatares/gato.png'   },
    { id: 'oso',    nombre: 'Oso',    img: 'avatares/oso.png'    },
    { id: 'conejo', nombre: 'Conejo', img: 'avatares/conejo.png' },
    { id: 'koala',  nombre: 'Koala',  img: 'avatares/koala.png'  },
  ];

  continuar() {
    if (this.avatarSeleccionado) {
      const avatar = this.avatares.find(a => a.id === this.avatarSeleccionado);
      if (avatar) localStorage.setItem('avatarImg', avatar.img);
    }
    this.router.navigate(['/cuestionario4']);
  }
}