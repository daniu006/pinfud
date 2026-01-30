
import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    photoUrl?: string; // Avatar
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private firestore = inject(Firestore);

    constructor() { }

    /**
     * Create a new user profile in Firestore
     */
    async createUserProfile(user: User, name: string): Promise<void> {
        const userRef = doc(this.firestore, `users/${user.uid}`);
        const userProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            name: name,
            createdAt: new Date().toISOString()
        };
        await setDoc(userRef, userProfile);
    }

    /**
     * Get user profile by UID
     */
    async getUserProfile(uid: string): Promise<UserProfile | null> {
        const userRef = doc(this.firestore, `users/${uid}`);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        } else {
            return null;
        }
    }

    /**
     * Update user profile
     */
    /**
     * Update user profile
     */
    async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
        const userRef = doc(this.firestore, `users/${uid}`);
        await updateDoc(userRef, data);
    }

    /**
     * Guardar plato en favoritos (Subcolección)
     */
    async saveDish(userId: string, dish: any): Promise<void> {
        const savedRef = doc(this.firestore, `users/${userId}/saved/${dish.id}`);

        // Firestore doesn't accept undefined values. We clean the object.
        const cleanDish = JSON.parse(JSON.stringify(dish));

        await setDoc(savedRef, {
            ...cleanDish,
            savedAt: new Date().toISOString()
        });
    }

    /**
     * Eliminar plato de favoritos
     */
    async removeSavedDish(userId: string, dishId: string | number): Promise<void> {
        const savedRef = doc(this.firestore, `users/${userId}/saved/${dishId}`);
        // Importamos deleteDoc arriba, o lo usamos directamente de firestore
        const { deleteDoc } = await import('@angular/fire/firestore');
        await deleteDoc(savedRef);
    }

    /**
     * Obtener platos guardados
     */
    async getSavedDishes(userId: string): Promise<any[]> {
        const { collection, getDocs } = await import('@angular/fire/firestore');
        const savedCol = collection(this.firestore, `users/${userId}/saved`);
        const snapshot = await getDocs(savedCol);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
}
