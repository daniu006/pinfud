import { Injectable, inject, signal, computed } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Auth } from '@angular/fire/auth';
import { ProfileViewModel } from '../profile/profile.viewmodel';
import { NotificationService } from '../../core/services/notification.service';
import { DishService } from '../../core/services/dish.service';
import { PhotoService } from '../../core/services/photo.service';

export interface Dish {
    id: string; // Ensure id is string for Firestore doc operations
    name: string;
    image: string;
    region: string;
    description?: string;
    userId?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DishViewModel {
    private userService = inject(UserService);
    private auth = inject(Auth);
    private profileViewModel = inject(ProfileViewModel);
    private notificationService = inject(NotificationService);
    private dishService = inject(DishService);
    private photoService = inject(PhotoService);

    // Estado del plato actual
    currentDish = signal<Dish | null>(null);

    // Estado de "me gusta"
    isLiked = signal<boolean>(false);

    // Estado de guardado
    isSaved = signal<boolean>(false);

    // Nombre del que subió el plato
    uploaderName = signal<string>('Usuario');

    // Computed to check if the current user is the owner
    isOwner = computed(() => {
        const user = this.auth.currentUser;
        const dish = this.currentDish();
        return !!(user && dish && dish.userId === user.uid);
    });

    constructor() { }

    // Establecer el plato actual
    setDish(dish: any): void {
        this.currentDish.set(dish as Dish);
        this.checkIfSaved(dish.id);
        if (dish.userId) {
            this.loadUploaderName(dish.userId);
        } else {
            this.uploaderName.set('Chef Pinfüd');
        }
    }

    // Toggle de "me gusta"
    async toggleLike(): Promise<void> {
        const currentUser = this.auth.currentUser;
        const dish = this.currentDish();

        if (!dish || !currentUser) return;

        const wasLiked = this.isLiked();
        this.isLiked.set(!wasLiked);

        // Si le dio me gusta y el plato tiene un dueño que no es el usuario actual
        if (!wasLiked && dish.userId && dish.userId !== currentUser.uid) {
            try {
                // Obtener perfil real del que da el like desde Firestore
                const userProfile = await this.userService.getUserProfile(currentUser.uid);
                const senderName = userProfile?.name || currentUser.displayName || 'Un usuario';

                await this.notificationService.addNotification(dish.userId, {
                    type: 'like',
                    title: '¡A alguien le gustó tu plato!',
                    message: `${senderName} le dio me gusta a tu plato: ${dish.name}`,
                    icon: 'heart',
                    userImage: currentUser.photoURL || 'assets/img/gato.jpeg',
                    fromUserId: currentUser.uid,
                    dishId: dish.id,
                    timestamp: new Date().toISOString(),
                    isRead: false
                });
            } catch (error) {
                console.error('Error al enviar notificación:', error);
            }
        }
    }

    private async loadUploaderName(userId: string): Promise<void> {
        try {
            const profile = await this.userService.getUserProfile(userId);
            this.uploaderName.set(profile?.name || 'Usuario');
        } catch (e) {
            this.uploaderName.set('Usuario');
        }
    }

    // Compartir plato
    async shareDish(): Promise<void> {
        const dish = this.currentDish();
        if (!dish) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: dish.name,
                    text: `Mira este delicioso plato: ${dish.name} de la región ${dish.region}`,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Error al compartir:', error);
            }
        }
    }

    // Descargar imagen
    async downloadImage(): Promise<void> {
        const dish = this.currentDish();
        if (!dish) return;

        try {
            const link = document.createElement('a');
            link.href = dish.image;
            link.download = `${dish.name}.jpg`;
            link.click();
        } catch (error) {
            console.error('Error al descargar:', error);
        }
    }

    // Guardar en favoritos (Firestore)
    async saveToFavorites(): Promise<void> {
        const dish = this.currentDish();
        const user = this.auth.currentUser;

        if (!dish || !user) return;

        // Toggle UI immediately (optimistic update)
        const wasSaved = this.isSaved();
        this.isSaved.set(!wasSaved);

        try {
            if (!wasSaved) {
                // Save logic
                await this.userService.saveDish(user.uid, dish);
            } else {
                // Remove logic
                await this.userService.removeSavedDish(user.uid, dish.id);
            }
            // Refresh profile data to show linkage immediately
            this.profileViewModel.loadUserData();
        } catch (error) {
            console.error('Error al guardar/eliminar plato:', error);
            this.isSaved.set(wasSaved); // Revert on error
        }
    }

    // Direct deletion for orphans or owner management
    async deleteCurrentDish(): Promise<boolean> {
        const dish = this.currentDish();
        const user = this.auth.currentUser;

        if (!dish || !user || dish.userId !== user.uid) {
            return false;
        }

        try {
            console.log('DEBUG: Direct deletion of dish initiated:', dish.id);

            // 1. Delete the dish itself
            await this.dishService.deleteDish(dish.id.toString());

            // 2. Try to find and delete the associated gallery photo if it exists
            const userPhotos = await this.photoService.getUserPhotos();
            const matchingPhoto = userPhotos.find(p => p.url === dish.image || p.dishId === dish.id);

            if (matchingPhoto) {
                console.log('DEBUG: Found associated gallery photo, deleting as well:', matchingPhoto.id);
                // We don't call deletePhoto to avoid redundant calls, just the metadata
                await this.photoService.deletePhoto(matchingPhoto);
            }

            console.log('DEBUG: Direct deletion successful');
            return true;
        } catch (error) {
            console.error('Error during direct deletion:', error);
            throw error;
        }
    }

    // Verificar si está guardado (Firestore check logic could be here, but usually passed via state or checked on load)
    private async checkIfSaved(dishId: string | number): Promise<void> {
        const user = this.auth.currentUser;
        if (!user) return;

        try {
            const savedDishes = await this.userService.getSavedDishes(user.uid);
            this.isSaved.set(savedDishes.some(d => d.id == dishId)); // Loose equality for string/number match
        } catch (e) {
            console.error(e);
        }
    }
}
