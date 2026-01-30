
import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    addDoc,
    query,
    getDocs,
    deleteDoc,
    doc,
    where,
    updateDoc
} from '@angular/fire/firestore';
import { Auth, User } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { DishService } from './dish.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular';

export interface Photo {
    id?: string;
    url: string;
    name: string;
    path: string;
    userId: string;
    dishId?: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class PhotoService {
    private firestore = inject(Firestore);
    private authService = inject(AuthService);
    private dishService = inject(DishService);
    private http = inject(HttpClient);
    private toastController = inject(ToastController);

    constructor() { }

    private async showToast(message: string, color: string = 'dark') {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            color,
            position: 'bottom'
        });
        await toast.present();
    }

    private async getAuthenticatedUser(): Promise<User> {
        const user = this.authService.getCurrentUser();
        if (!user) throw new Error('User not authenticated');
        return user;
    }

    // Expose this publicly for orchestration
    async uploadImageToCloudinary(blob: Blob): Promise<string> {
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('upload_preset', environment.cloudinary.uploadPreset);
        formData.append('cloud_name', environment.cloudinary.cloudName);

        const clUrl = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`;

        try {
            const response: any = await firstValueFrom(this.http.post(clUrl, formData));
            return response.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    }

    async savePhotoMetadata(url: string, name: string, dishId?: string): Promise<Photo> {
        const user = await this.getAuthenticatedUser();

        const photoData: Photo = {
            url,
            name,
            path: '',
            userId: user.uid,
            dishId: dishId || '',
            createdAt: new Date().toISOString()
        };

        const photosCollection = collection(this.firestore, `users/${user.uid}/photos`);
        const docRef = await addDoc(photosCollection, photoData);

        return { ...photoData, id: docRef.id };
    }

    async uploadPhoto(blob: Blob, name: string, dishId?: string): Promise<Photo> {
        const url = await this.uploadImageToCloudinary(blob);
        return await this.savePhotoMetadata(url, name, dishId);
    }

    async getUserPhotos(): Promise<Photo[]> {
        const user = this.authService.getCurrentUser();
        if (!user) return [];

        const photosCollection = collection(this.firestore, `users/${user.uid}/photos`);
        const q = query(photosCollection);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Photo));
    }

    async deletePhoto(photo: Photo): Promise<void> {
        const user = this.authService.getCurrentUser();
        if (!user || !photo.id) {
            console.warn('DEBUG: Cannot delete photo. User or ID missing.', { userId: user?.uid, photoId: photo.id });
            return;
        }

        console.log('DEBUG: Deleting photo metadata from Firestore:', photo.id);
        const docRef = doc(this.firestore, `users/${user.uid}/photos/${photo.id}`);

        try {
            // 1. Delete photo metadata
            await deleteDoc(docRef);
            console.log('DEBUG: Photo metadata deleted successfully');

            // 2. Delete linked dish if exists (by ID)
            if (photo.dishId) {
                console.log('DEBUG: Found linked dishId, attempting deletion:', photo.dishId);
                await this.dishService.deleteDish(photo.dishId);
            } else {
                // 3. Fallback: Search for orphan dishes by URL to clean up "old" data
                console.log('DEBUG: No dishId found, searching for dishes with same URL for cleanup...');
                const dishesCol = collection(this.firestore, 'dishes');
                const q = query(dishesCol, where('image', '==', photo.url), where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);

                for (const dishDoc of querySnapshot.docs) {
                    console.log('DEBUG: Found orphan dish by URL, deleting:', dishDoc.id);
                    await this.dishService.deleteDish(dishDoc.id);
                }
            }

            await this.showToast('Foto eliminada correctamente');
        } catch (error: any) {
            console.error('DEBUG: Error in deletion process:', error);
            await this.showToast('Error al eliminar: ' + error.message, 'danger');
            throw error;
        }
    }

    async updatePhotoMetadata(photoId: string, data: Partial<Photo>): Promise<void> {
        const user = this.authService.getCurrentUser();
        if (!user) throw new Error('User not authenticated');

        console.log('DEBUG: Updating photo metadata:', photoId, data);
        const docRef = doc(this.firestore, `users/${user.uid}/photos/${photoId}`);
        await updateDoc(docRef, data);
        console.log('DEBUG: Photo metadata updated successfully');
    }
}
