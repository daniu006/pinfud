import { Injectable, signal } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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

    // Señales para el estado
    selectedImage = signal<string | null>(null);
    dishName = signal<string>('');
    selectedRegion = signal<string>('');
    description = signal<string>('');
    isUploading = signal<boolean>(false);

    // Regiones disponibles
    regions = [
        { id: 'costa', name: 'Costa' },
        { id: 'sierra', name: 'Sierra' },
        { id: 'oriente', name: 'Oriente' },
        { id: 'galapagos', name: 'Galápagos' }
    ];

    constructor() { }

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
            // Ignorar si el usuario canceló la selección
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
                console.log('Imagen seleccionada:', image.dataUrl.substring(0, 50) + '...');
                this.selectedImage.set(image.dataUrl);
            }
        } catch (error: any) {
            // Ignorar si el usuario canceló la selección
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

    // Subir plato (por ahora guarda en localStorage, listo para Firebase)
    async uploadDish(): Promise<boolean> {
        if (!this.isFormValid()) {
            return false;
        }

        this.isUploading.set(true);

        try {
            const dish: DishUpload = {
                image: this.selectedImage()!,
                name: this.dishName(),
                region: this.selectedRegion(),
                description: this.description()
            };

            // Guardar en localStorage (temporal, aquí irá Firebase)
            const savedDishes = this.getSavedDishes();
            savedDishes.push(dish);
            localStorage.setItem('uploadedDishes', JSON.stringify(savedDishes));

            // Limpiar formulario
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
    }

    // Obtener platos guardados
    private getSavedDishes(): DishUpload[] {
        const saved = localStorage.getItem('uploadedDishes');
        return saved ? JSON.parse(saved) : [];
    }
}
