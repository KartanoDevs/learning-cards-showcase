import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, MenubarModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  toggleSidebar() {
    // abrir/cerrar sidebar
  }

  toggleTheme() {
    // cambiar claro/oscuro
  }

  openColorPicker() {
    // abrir selector de colores
  }

  openCalendar() {}
  openMessages() {}
  openProfile() {}
}
