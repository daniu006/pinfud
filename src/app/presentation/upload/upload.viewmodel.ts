import { Injectable, inject, signal } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoService } from '../../core/services/photo.service';
import { DishService, Dish } from '../../core/services/dish.service';
import { Auth } from '@angular/fire/auth';

export interface DishUpload {
    image: string;
    name: string;
    region: string;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class UploadViewModel {
    private photoService = inject(PhotoService);
    private dishService = inject(DishService);
    private auth = inject(Auth);

    // Señales para el estado
    selectedImage = signal<string | null>(null);
    dishName = signal<string>('');
    selectedRegion = signal<string>('');
    description = signal<string>('');
    isUploading = signal<boolean>(false);
    currentPhotoId = signal<string | null>(null);

    // Regiones disponibles
    regions = [
        { id: 'costa', name: 'Costa' },
        { id: 'sierra', name: 'Sierra' },
        { id: 'oriente', name: 'Oriente' },
        { id: 'galapagos', name: 'Galápagos' }
    ];

    constructor() { }

    // Set an image already hosted (e.g. from Gallery)
    setPreselectedImage(url: string, photoId?: string): void {
        this.selectedImage.set(url);
        if (photoId) {
            this.currentPhotoId.set(photoId);
        }
    }

    // Tomar foto con la cámara
    async takePhoto(): Promise<void> {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera
            });

            if (image.dataUrl) {
                this.selectedImage.set(image.dataUrl);
            }
        } catch (error: any) {
            if (error?.message?.toLowerCase().includes('cancelled')) {
                return;
            }
            console.error('Error al tomar foto:', error);
        }
    }

    // Seleccionar de galería
    async selectFromGallery(): Promise<void> {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Photos
            });

            if (image.dataUrl) {
                this.selectedImage.set(image.dataUrl);
            }
        } catch (error: any) {
            if (error?.message?.toLowerCase().includes('cancelled')) {
                return;
            }
            console.error('Error al seleccionar imagen:', error);
        }
    }

    // Validar formulario
    isFormValid(): boolean {
        return !!(
            this.selectedImage() &&
            this.dishName().trim() &&
            this.selectedRegion() &&
            this.description().trim()
        );
    }

    // Helper to convert DataURL to Blob
    private dataURItoBlob(dataURI: string): Blob {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    // Subir plato usando PhotoService y DishService
    async uploadDish(): Promise<boolean> {
        if (!this.isFormValid()) {
            return false;
        }

        this.isUploading.set(true);

        try {
            const imageData = this.selectedImage();
            const photoId = this.currentPhotoId();
            if (!imageData) return false;

            let downloadUrl = imageData;

            // 1. If it's a DataURL (base64), it's a new photo -> Upload to Cloudinary
            if (imageData.startsWith('data:')) {
                const blob = this.dataURItoBlob(imageData);
                downloadUrl = await this.photoService.uploadImageToCloudinary(blob);
            }

            // 2. Create the Dish in the public collection
            const fileName = this.dishName();
            const currentUser = this.auth.currentUser;
            const newDish: Dish = {
                name: this.dishName(),
                description: this.description(),
                image: downloadUrl,
                region: this.selectedRegion(),
                userId: currentUser?.uid,
                createdAt: new Date().toISOString()
            };

            const dishId = await this.dishService.addDish(newDish);

            // 3. Link metadata
            if (photoId) {
                // UPDATE existing photo record if it came from the gallery
                console.log('DEBUG: Updating existing photo metadata with dishId:', photoId, dishId);
                await this.photoService.updatePhotoMetadata(photoId, { dishId });
            } else {
                // SAVE new photo metadata if it's a fresh upload
                console.log('DEBUG: Creating new photo metadata with dishId:', dishId);
                await this.photoService.savePhotoMetadata(downloadUrl, fileName, dishId);
            }

            this.resetForm();
            this.isUploading.set(false);
            return true;
        } catch (error) {
            console.error('Error al subir plato:', error);
            this.isUploading.set(false);
            return false;
        }
    }

    // Resetear formulario
    resetForm(): void {
        this.selectedImage.set(null);
        this.dishName.set('');
        this.selectedRegion.set('');
        this.description.set('');
        this.currentPhotoId.set(null);
    }
}
