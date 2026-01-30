import { Injectable, inject, signal, computed } from '@angular/core';
import { UserService, UserProfile } from '../../core/services/user.service';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { PhotoService } from '../../core/services/photo.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

export interface SavedDish {
  id: string; // Changed to string to match Firestore ID
  name: string;
  image: string;
  region?: string; // Optional now
}

@Injectable({
  providedIn: 'root'
})
export class ProfileViewModel {
  private userService = inject(UserService);
  private auth = inject(Auth);
  private photoService = inject(PhotoService);
  private router = inject(Router);

  // Estado del usuario
  user = signal<UserProfile | null>(null);

  // Estado de loading
  isLoading = signal<boolean>(false);

  // Estado de notificaciones
  hasNotifications = signal<boolean>(true);

  // Platos subidos por mí (Mis Fotos)
  myPhotos = signal<SavedDish[]>([]);

  // Platos guardados de otros (Favoritos)
  bookmarkedDishes = signal<SavedDish[]>([]);

  // Platos guardados (Favoritos) - Antes combinaba con Mis Fotos, ahora solo guardados
  allDishes = computed(() => {
    return this.bookmarkedDishes();
  });

  // Computed: counts
  myPhotosCount = computed(() => this.myPhotos().length);
  bookmarkedCount = computed(() => this.bookmarkedDishes().length);
  allDishesCount = computed(() => this.allDishes().length);

  // Computed: checks
  hasMyPhotos = computed(() => this.myPhotos().length > 0);
  hasBookmarks = computed(() => this.bookmarkedDishes().length > 0);
  hasAnyDish = computed(() => this.allDishes().length > 0);

  // Computed: Avatar seguro (con fallback)
  safeAvatar = computed(() => {
    const u = this.user();
    if (u && u.photoUrl) return u.photoUrl;
    return 'assets/img/gato.jpeg'; // Fallback por defecto
  });

  // Método para cerrar sesión
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/welcome'], { replaceUrl: true });
  }

  // Método para cargar datos del usuario y sus fotos
  async loadUserData(): Promise<void> {
    this.isLoading.set(true);
    try {
      // Esperar a Auth
      const currentUser = await firstValueFrom(authState(this.auth).pipe(take(1)));

      if (currentUser) {
        // 1. Cargar Perfil
        let profile = await this.userService.getUserProfile(currentUser.uid);

        // Si no existe perfil en Firestore, usar datos de Auth y crearlo
        if (!profile) {
          // ... (profile creation logic)
          // (truncated for brevity, ensure existing logic is preserved)
          const newProfile: UserProfile = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            name: currentUser.displayName || 'Usuario',
            photoUrl: currentUser.photoURL || '',
            createdAt: new Date().toISOString()
          };
          this.userService.createUserProfile(currentUser, newProfile.name).catch(e => console.error('Error creando perfil:', e));
          profile = newProfile;
        }
        this.user.set(profile);

        // 2. Cargar Mis Fotos (Subidas)
        const photos = await this.photoService.getUserPhotos();
        const myDishes: SavedDish[] = photos.map(p => ({
          id: p.id || '',
          name: p.name,
          image: p.url,
          region: 'Ecuador'
        }));
        this.myPhotos.set(myDishes);

        // 3. Cargar Favoritos (Guardados)
        const bookmarks = await this.userService.getSavedDishes(currentUser.uid);
        const savedDishes: SavedDish[] = bookmarks.map(b => ({
          id: b.id,
          name: b.name,
          image: b.image,
          region: b.region
        }));
        this.bookmarkedDishes.set(savedDishes);
      }
    } catch (error) {
      console.error('Error cargando perfil:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Actualizar Avatar
  async updateAvatar(blob: Blob): Promise<void> {
    this.isLoading.set(true);
    try {
      const currentUser = this.auth.currentUser;
      if (!currentUser) return;

      // 1. Subir a Cloudinary
      const url = await this.photoService.uploadImageToCloudinary(blob);

      // 2. Actualizar Firestore
      await this.userService.updateUserProfile(currentUser.uid, { photoUrl: url });

      // 3. Actualizar Auth Profile (esto sincroniza el Header en Home)
      const { updateProfile } = await import('@angular/fire/auth');
      await updateProfile(currentUser, { photoURL: url });

      // 4. Actualizar estado local
      const currentProfile = this.user();
      if (currentProfile) {
        this.user.set({ ...currentProfile, photoUrl: url });
      }

    } catch (error) {
      console.error('Error actualizando avatar:', error);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  // Método para marcar notificaciones como leídas
  markNotificationsAsRead(): void {
    this.hasNotifications.set(false);
  }
}
