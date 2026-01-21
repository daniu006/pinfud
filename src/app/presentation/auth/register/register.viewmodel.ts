import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterViewModel {
  // 1. Estado del formulario
  name: string = 'Daniu';
  email: string = 'daniu@gmail.com';
  password: string = '123456';
  confirmPassword: string = '123456';

  // 2. Estado de loading y error
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor() {}

  // 3. Validación de campos y que passwords coincidan
  validateFields(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.name || this.name.trim().length < 2) {
      this.errorMessage = 'El nombre es obligatorio.';
      return false;
    }
    if (!this.email || !emailRegex.test(this.email)) {
      this.errorMessage = 'Ingresa un correo electrónico válido.';
      return false;
    }
    if (!this.password || this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return false;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  // 4. Método para ejecutar registro (simulado)
  async executeRegister(): Promise<boolean> {
    if (!this.validateFields()) return false;

    this.isLoading = true;
    try {
      // Simulación de delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      this.errorMessage = 'Error al crear la cuenta. Inténtalo de nuevo.';
      return false;
    } finally {
      this.isLoading = false;
    }
  }
}