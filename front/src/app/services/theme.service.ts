import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  // Signal para almacenar el color primario (ej. el azul por defecto de PrimeNG)
  public primaryColor = signal<string>('#42A5F5');

  constructor() {
    // 1. Intentar cargar el color guardado en el navegador (si existe)
    if (typeof localStorage !== 'undefined') {
        const savedColor = localStorage.getItem('appPrimaryColor');
        if (savedColor) {
            this.primaryColor.set(savedColor);
        }
    }

    // 2. Efecto (o suscripción implícita) para aplicar el color
    // Usamos .subscribe() en este contexto de inicialización para aplicar el color inicial.
    this.applyColor(this.primaryColor());
  }

  /**
   * Aplica el color primario a las variables CSS globales para que los temas de PrimeNG
   * y los estilos personalizados lo reconozcan.
   * @param color Valor hexadecimal del color.
   */
  private applyColor(color: string): void {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--primary-color', color);
      // Opcional: Si está usando PrimeNG con un preset de tema (e.g., Aura/Lara) que
      // requiere una paleta más profunda, podría necesitar regenerar o simular tonos.
      // Aquí usamos el color principal y asumimos que el tema base de PrimeNG usa esta variable.
      document.documentElement.style.setProperty('--primary-500', color);
    }
  }

  /**
   * Método público para cambiar y guardar el color primario.
   */
  setPrimaryColor(color: string): void {
    this.primaryColor.set(color);
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('appPrimaryColor', color);
    }
  }
}
