import { Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

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
  showPassword: boolean = false;

  constructor(private authService: AuthService) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

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

  // Método para ejecutar login
  async login() {
    if (!this.isFormValid()) return false;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.login(this.email, this.password);
      return true;
    } catch (error: any) {
      console.error(error);
      this.errorMessage = this.handleError(error);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithGoogle() {
    this.isLoading = true;
    this.errorMessage = '';
    try {
      await this.authService.loginWithGoogle();
      return true;
    } catch (error: any) {
      console.error(error);
      this.errorMessage = 'Google Login failed: ' + error.message;
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  private handleError(error: any): string {
    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Credenciales incorrectas.';
      case 'auth/user-not-found':
        return 'Usuario no encontrado.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      default:
        return 'Error al iniciar sesión: ' + (error.message || 'Desconocido');
    }
  }
}