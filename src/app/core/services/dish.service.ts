
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, orderBy, limit, doc, deleteDoc } from '@angular/fire/firestore';

export interface Dish {
    id?: string;
    name: string;
    description: string;
    image: string; // Cloudinary URL
    region: string;
    category?: string; // Derived from region or separate
    userId?: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class DishService {
    private firestore = inject(Firestore);

    constructor() { }

    async addDish(dish: Dish): Promise<string> {
        const dishesCol = collection(this.firestore, 'dishes');
        const docRef = await addDoc(dishesCol, {
            ...dish,
            createdAt: dish.createdAt || new Date().toISOString()
        });
        console.log('DEBUG: Dish added with ID:', docRef.id);
        return docRef.id;
    }

    async deleteDish(dishId: string): Promise<void> {
        console.log('DEBUG: Attempting to delete dish:', dishId);
        const docRef = doc(this.firestore, 'dishes', dishId);
        await deleteDoc(docRef);
        console.log('DEBUG: Dish deleted successfully');
    }

    async getDishes(): Promise<Dish[]> {
        const dishesCol = collection(this.firestore, 'dishes');
        // Order by newest first
        const q = query(dishesCol, orderBy('createdAt', 'desc'), limit(50));

        try {
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Dish));
        } catch (error) {
            console.error('Error fetching dishes:', error);
            return [];
        }
    }
}
