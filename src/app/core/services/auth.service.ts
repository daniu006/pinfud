import { Injectable, inject } from '@angular/core';
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider,
    User,
    UserCredential
} from '@angular/fire/auth';

export interface AuthResult {
    success: boolean;
    message: string;
    user?: User;
    needsVerification?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);

    // Social providers
    private googleProvider = new GoogleAuthProvider();
    private facebookProvider = new FacebookAuthProvider();
    private twitterProvider = new TwitterAuthProvider();

    constructor() { }

    /**
     * Get the current authenticated user
     */
    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }

    /**
     * Check if user's email is verified
     */
    isEmailVerified(): boolean {
        const user = this.auth.currentUser;
        return user?.emailVerified ?? false;
    }

    /**
     * Register a new user with email and password
     */
    async register(email: string, password: string): Promise<AuthResult> {
        try {
            const userCredential: UserCredential = await createUserWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            return {
                success: true,
                message: '¡Cuenta creada exitosamente!',
                user: userCredential.user
            };
        } catch (error: any) {
            return {
                success: false,
                message: this.getErrorMessage(error.code)
            };
        }
    }

    /**
     * Sign in with email and password
     */
    async login(email: string, password: string): Promise<AuthResult> {
        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(
                this.auth,
                email,
                password
            );

            return {
                success: true,
                message: '¡Bienvenido!',
                user: userCredential.user
            };
        } catch (error: any) {
            return {
                success: false,
                message: this.getErrorMessage(error.code)
            };
        }
    }

    /**
     * Sign in with Google
     */
    async signInWithGoogle(): Promise<AuthResult> {
        try {
            const result = await signInWithPopup(this.auth, this.googleProvider);
            return {
                success: true,
                message: '¡Bienvenido con Google!',
                user: result.user
            };
        } catch (error: any) {
            return {
                success: false,
                message: this.getErrorMessage(error.code)
            };
        }
    }

    /**
     * Sign in with Facebook
     */
    async signInWithFacebook(): Promise<AuthResult> {
        try {
            const result = await signInWithPopup(this.auth, this.facebookProvider);
            return {
                success: true,
                message: '¡Bienvenido con Facebook!',
                user: result.user
            };
        } catch (error: any) {
            return {
                success: false,
                message: this.getErrorMessage(error.code)
            };
        }
    }

    /**
     * Sign in with Twitter
     */
    async signInWithTwitter(): Promise<AuthResult> {
        try {
            const result = await signInWithPopup(this.auth, this.twitterProvider);
            return {
                success: true,
                message: '¡Bienvenido con Twitter!',
                user: result.user
            };
        } catch (error: any) {
            return {
                success: false,
                message: this.getErrorMessage(error.code)
            };
        }
    }

    /**
     * Send verification email to current user
     */
    async sendVerificationEmail(): Promise<AuthResult> {
        try {
            const user = this.auth.currentUser;
            if (user) {
                await sendEmailVerification(user);
                return {
                    success: true,
                    message: 'Email de verificación enviado.'
                };
            }
            return {
                success: false,
                message: 'No hay usuario autenticado.'
            };
        } catch (error: any) {
            return {
                success: false,
                message: this.getErrorMessage(error.code)
            };
        }
    }

    /**
     * Sign out the current user
     */
    async logout(): Promise<void> {
        await signOut(this.auth);
    }

    /**
     * Convert Firebase error codes to user-friendly messages in Spanish
     */
    private getErrorMessage(errorCode: string): string {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'Este correo electrónico ya está registrado.';
            case 'auth/invalid-email':
                return 'El correo electrónico no es válido.';
            case 'auth/operation-not-allowed':
                return 'Este método de inicio de sesión no está habilitado.';
            case 'auth/weak-password':
                return 'La contraseña es muy débil. Usa al menos 6 caracteres.';
            case 'auth/user-disabled':
                return 'Esta cuenta ha sido deshabilitada.';
            case 'auth/user-not-found':
                return 'No existe una cuenta con este correo electrónico.';
            case 'auth/wrong-password':
                return 'Contraseña incorrecta.';
            case 'auth/invalid-credential':
                return 'Credenciales inválidas. Verifica tu correo y contraseña.';
            case 'auth/too-many-requests':
                return 'Demasiados intentos fallidos. Intenta más tarde.';
            case 'auth/popup-closed-by-user':
                return 'El inicio de sesión fue cancelado.';
            case 'auth/cancelled-popup-request':
                return 'Operación cancelada.';
            case 'auth/account-exists-with-different-credential':
                return 'Ya existe una cuenta con este correo usando otro método de inicio de sesión.';
            default:
                return 'Error de autenticación. Inténtalo de nuevo.';
        }
    }
}
