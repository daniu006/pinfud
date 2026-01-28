import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginViewModel {
  private authService = inject(AuthService);

  // Estado del formulario
  email: string = '';
  password: string = '';

  // Estados de la interfaz
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  needsVerification: boolean = false;

  constructor() { }

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

  // Método para ejecutar login con Firebase
  async login(): Promise<boolean> {
    if (!this.isFormValid()) return false;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.needsVerification = false;

    try {
      const result = await this.authService.login(this.email, this.password);

      if (result.success) {
        this.successMessage = result.message;
        return true;
      } else {
        this.errorMessage = result.message;
        this.needsVerification = result.needsVerification ?? false;
        return false;
      }
    } catch (error) {
      this.errorMessage = 'Error al iniciar sesión. Inténtalo de nuevo.';
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  // Login con Google
  async loginWithGoogle(): Promise<boolean> {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const result = await this.authService.signInWithGoogle();
      if (result.success) {
        this.successMessage = result.message;
        return true;
      } else {
        this.errorMessage = result.message;
        return false;
      }
    } finally {
      this.isLoading = false;
    }
  }

  // Login con Facebook
  async loginWithFacebook(): Promise<boolean> {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const result = await this.authService.signInWithFacebook();
      if (result.success) {
        this.successMessage = result.message;
        return true;
      } else {
        this.errorMessage = result.message;
        return false;
      }
    } finally {
      this.isLoading = false;
    }
  }

  // Login con Twitter
  async loginWithTwitter(): Promise<boolean> {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const result = await this.authService.signInWithTwitter();
      if (result.success) {
        this.successMessage = result.message;
        return true;
      } else {
        this.errorMessage = result.message;
        return false;
      }
    } finally {
      this.isLoading = false;
    }
  }

  // Método para cerrar sesión
  async logout(): Promise<void> {
    await this.authService.logout();
  }

  // Limpiar formulario
  clearForm(): void {
    this.email = '';
    this.password = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.needsVerification = false;
  }
}

