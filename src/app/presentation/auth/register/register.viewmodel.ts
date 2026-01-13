import { Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RegisterViewModel {
    email: string = '';
    password: string = '';
    confirmPassword: string = '';

    isLoading: boolean = false;
    errorMessage: string = '';
    showPassword: boolean = false;
    showConfirmPassword: boolean = false;

    constructor(private authService: AuthService) { }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    toggleConfirmPassword() {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

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
        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'Las contraseñas no coinciden.';
            return false;
        }
        this.errorMessage = '';
        return true;
    }

    async register() {
        if (!this.isFormValid()) return false;

        this.isLoading = true;
        this.errorMessage = '';

        try {
            await this.authService.register(this.email, this.password);
            return true;
        } catch (error: any) {
            console.error(error);
            this.errorMessage = this.handleError(error);
            return false;
        } finally {
            this.isLoading = false;
        }
    }

    private handleError(error: any): string {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return 'Ya existe una cuenta con este correo.';
            case 'auth/invalid-email':
                return 'Correo inválido.';
            case 'auth/weak-password':
                return 'Contraseña muy débil.';
            default:
                return 'Error al registrarse: ' + (error.message || 'Desconocido');
        }
    }
}
