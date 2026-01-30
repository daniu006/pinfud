import { Injectable, inject, signal, computed } from '@angular/core';
import { DishService } from '../../core/services/dish.service';
import { UserService } from '../../core/services/user.service';
import { Auth, user } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { NotificationsViewModel } from '../notifications/notifications.viewmodel';

export interface FoodImage {
  id: string | number;
  src: string;
  categoryId: number;
  name?: string;
  description?: string;
  isUploaded?: boolean;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HomeViewModel {
  private dishService = inject(DishService);
  private notificationVM = inject(NotificationsViewModel);
  private auth = inject(Auth);
  private userService = inject(UserService);

  // Perfil del usuario desde Firestore
  userProfile = signal<any>(null);

  // Usuario actual (Reactivo)
  currentUser = toSignal(user(this.auth));

  // Nombre de usuario formateado
  userName = computed(() => {
    const p = this.userProfile();
    if (p && p.name) return p.name.split(' ')[0];

    const u = this.currentUser();
    if (!u?.displayName) return 'Chef';
    return u.displayName.split(' ')[0];
  });

  // Estado actual
  selectedCategory: number = 1;

  // Usar la señal del NotificationsViewModel para el punto rojo del footer
  get hasNotifications() {
    return this.notificationVM.hasUnread();
  }

  // Datos (Movidos desde home.page.ts)
  categories = [
    { id: 1, name: 'Para ti' },
    { id: 2, name: 'Costa' },
    { id: 3, name: 'Sierra' },
    { id: 4, name: 'Oriente' },
    { id: 5, name: 'Galapagos' },
  ];

  // Mapeo de regiones a category IDs
  private regionToCategoryId: { [key: string]: number } = {
    'costa': 2,
    'sierra': 3,
    'oriente': 4,
    'galapagos': 5
  };

  // Imágenes estáticas originales (readonly)
  private readonly staticImages: FoodImage[] = [
    { id: 1, src: 'assets/img/bolloPescado.jpg', categoryId: 2, name: 'Bollo de Pescado' },
    { id: 2, src: 'assets/img/fritada.jpg', categoryId: 3, name: 'Fritada' },
    { id: 3, src: 'assets/img/bolones.jpg', categoryId: 2, name: 'Bolón de Verde' },
    { id: 4, src: 'assets/img/caldoSalchicha.jpg', categoryId: 2, name: 'Caldo de Salchicha' },
    { id: 5, src: 'assets/img/encebollado.jpg', categoryId: 2, name: 'Encebollado' },
    { id: 6, src: 'assets/img/ceviche.jpg', categoryId: 2, name: 'Ceviche' },
    { id: 7, src: 'assets/img/cuyAsado.jpg', categoryId: 3, name: 'Cuy Asado' },
    { id: 8, src: 'assets/img/chichaJora.jpg', categoryId: 3, name: 'Chicha de Jora' },
    { id: 9, src: 'assets/img/corviche.jpg', categoryId: 2, name: 'Corviche' },
    { id: 10, src: 'assets/img/coladaMorada.jpg', categoryId: 3, name: 'Colada Morada' }
  ];

  // Lista combinada (subidas + estáticas) (ahora con ID string|number)
  foodImages: FoodImage[] = [];

  // Lista que se muestra en la UI
  filteredImages: FoodImage[] = [];

  constructor() {
    this.initUser();
    this.loadAllImages();
  }

  private initUser() {
    user(this.auth).subscribe(async u => {
      if (u) {
        const profile = await this.userService.getUserProfile(u.uid);
        this.userProfile.set(profile);
      } else {
        this.userProfile.set(null);
      }
    });
  }

  // Cargar todas las imágenes incluyendo las subidas
  async loadAllImages() {
    const uploadedDishes = await this.getUploadedDishes();
    // Combinar subidas (primero) + estáticas
    this.foodImages = [...uploadedDishes, ...this.staticImages];
    this.filterByCategory(this.selectedCategory);
  }

  // Obtener platos subidos desde Firestore
  private async getUploadedDishes(): Promise<FoodImage[]> {
    try {
      const dishes = await this.dishService.getDishes();

      return dishes.map(dish => ({
        id: dish.id || Math.random(),
        src: dish.image,
        categoryId: this.regionToCategoryId[dish.region.toLowerCase()] || 1,
        name: dish.name,
        description: dish.description,
        isUploaded: true,
        userId: dish.userId
      }));
    } catch {
      return [];
    }
  }

  // Lógica de filtrado
  filterByCategory(categoryId: number) {
    this.selectedCategory = categoryId;
    if (categoryId === 1) {
      this.filteredImages = [...this.foodImages];
    } else {
      this.filteredImages = this.foodImages.filter(img => img.categoryId === categoryId);
    }
  }

  markNotificationsAsRead() {
    this.notificationVM.markAllAsRead();
  }
}