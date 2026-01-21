import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginViewModel {
  // Estado del formulario
  email: string = 'daniu@gmail.com';
  password: string = '123456';

  // Estados de la interfaz
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor() {}

  // Método para validar campos
  isFormValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !emailRegex.test(this.email)) {
      this.errorMessage = 'Por favor, ingresa un correo válido.';
      return false;
    }
    if (!this.password || this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  // Método para ejecutar login (simulado)
  async login() {
    if (!this.isFormValid()) return false;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Simulamos una espera de red de 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      this.errorMessage = 'Error al iniciar sesión. Inténtalo de nuevo.';
      return false;
    } finally {
      this.isLoading = false;
    }
  }
}
