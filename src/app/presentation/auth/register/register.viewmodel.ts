import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterViewModel {
  private authService = inject(AuthService);

  // Estado del formulario
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  // Estado de loading y error
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  registrationComplete: boolean = false;

  constructor() { }

  // Validación de campos y que passwords coincidan
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

  // Método para ejecutar registro con Firebase
  async executeRegister(): Promise<boolean> {
    if (!this.validateFields()) return false;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const result = await this.authService.register(this.email, this.password);

      if (result.success) {
        this.successMessage = result.message;
        this.registrationComplete = true;
        return true;
      } else {
        this.errorMessage = result.message;
        return false;
      }
    } catch (error) {
      this.errorMessage = 'Error al crear la cuenta. Inténtalo de nuevo.';
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  // Limpiar formulario
  clearForm(): void {
    this.name = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.registrationComplete = false;
  }
}