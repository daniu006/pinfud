
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ActionSheetController, ViewWillEnter } from '@ionic/angular';
import { PhotoService, Photo } from '../../core/services/photo.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { trash, create, add, close, cloudUploadOutline, imagesOutline, ellipsisHorizontal, cameraOutline, images } from 'ionicons/icons';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.page.html',
    styleUrls: ['./gallery.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule]
})
export class GalleryPage implements OnInit, ViewWillEnter {
    private photoService = inject(PhotoService);
    private alertController = inject(AlertController);
    private actionSheetController = inject(ActionSheetController);
    private router = inject(Router);
    private auth = inject(Auth);

    photos: Photo[] = [];
    isLoading = false;

    constructor() {
        addIcons({
            trash,
            create,
            add,
            close,
            'cloud-upload-outline': cloudUploadOutline,
            'images-outline': imagesOutline,
            'ellipsis-horizontal': ellipsisHorizontal,
            'camera-outline': cameraOutline
        });
    }

    ngOnInit() {
        // Initial load check
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.loadPhotos();
            }
        });
    }

    ionViewWillEnter() {
        this.loadPhotos();
    }

    async loadPhotos() {
        this.isLoading = true;
        try {
            this.photos = await this.photoService.getUserPhotos();
        } catch (error) {
            console.error('Error loading photos', error);
        } finally {
            this.isLoading = false;
        }
    }

    async selectUploadMethod() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Subir Foto',
            buttons: [
                {
                    text: 'Cámara',
                    icon: 'camera-outline',
                    handler: () => {
                        this.takePhoto(CameraSource.Camera);
                    }
                },
                {
                    text: 'Galería',
                    icon: 'images-outline',
                    handler: () => {
                        this.takePhoto(CameraSource.Photos);
                    }
                },
                {
                    text: 'Cancelar',
                    icon: 'close',
                    role: 'cancel'
                }
            ]
        });
        await actionSheet.present();
    }

    async takePhoto(source: CameraSource) {
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: source
            });

            if (image.dataUrl) {
                this.isLoading = true;
                const blob = this.dataURItoBlob(image.dataUrl);
                await this.photoService.uploadPhoto(blob, `Photo_${new Date().getTime()}.jpg`);
                await this.loadPhotos();
            }
        } catch (error) {
            console.error('Error with camera/gallery', error);
        } finally {
            this.isLoading = false;
        }
    }

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

    async openPhotoOptions(photo: Photo) {
        const actionSheet = await this.actionSheetController.create({
            header: 'Opciones de Foto',
            buttons: [
                {
                    text: 'Publicar como plato',
                    icon: 'cloud-upload-outline',
                    handler: () => {
                        this.publishAsDish(photo);
                    }
                },
                {
                    text: 'Eliminar',
                    role: 'destructive',
                    icon: 'trash',
                    handler: () => {
                        this.deletePhoto(photo);
                    }
                },
                {
                    text: 'Cancelar',
                    icon: 'close',
                    role: 'cancel',
                }
            ]
        });
        await actionSheet.present();
    }

    publishAsDish(photo: Photo) {
        // Navigate to upload with image URL and photoId in state
        this.router.navigate(['/upload'], {
            state: {
                preselectedImage: photo.url,
                photoId: photo.id
            }
        });
    }

    async deletePhoto(photo: Photo) {
        const alert = await this.alertController.create({
            header: 'Confirmar',
            message: '¿Estás seguro de que quieres eliminar esta foto?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Eliminar',
                    role: 'destructive',
                    handler: async () => {
                        this.isLoading = true;
                        try {
                            console.log('DEBUG: GalleryPage calling deletePhoto for:', photo.id);
                            await this.photoService.deletePhoto(photo);
                            console.log('DEBUG: Deletion successful, refreshing gallery...');
                            await this.loadPhotos();
                        } catch (error) {
                            console.error('DEBUG: Error in GalleryPage deletion flow:', error);
                        } finally {
                            this.isLoading = false;
                        }
                    }
                }
            ]
        });
        await alert.present();
    }
}
