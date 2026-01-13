import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth: Auth = inject(Auth);
    private googleProvider = new GoogleAuthProvider();
    user$: Observable<User | null> = user(this.auth);

    constructor() { }

    async register(email: string, pass: string) {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, pass);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    async login(email: string, pass: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, pass);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    async loginWithGoogle() {
        try {
            const userCredential = await signInWithPopup(this.auth, this.googleProvider);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            await signOut(this.auth);
        } catch (error) {
            throw error;
        }
    }

    getUser() {
        return this.user$;
    }
}
