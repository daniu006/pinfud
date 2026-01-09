import { Injectable, signal, computed } from '@angular/core';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export interface SavedDish {
  id: number;
  name: string;
  image: string;
  region: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileViewModel {

  // Estado del usuario (mock data por ahora)
  user = signal<UserProfile>({
    id: 1,
    name: 'Daniu',
    email: 'daniu@email.com',
    avatar: 'assets/img/gato.jpeg'
  });

  // Estado de loading
  isLoading = signal<boolean>(false);

  // Estado de notificaciones
  hasNotifications = signal<boolean>(true);

  // Platos guardados por el usuario (mock data)
  savedDishes = signal<SavedDish[]>([
    { id: 1, name: 'Encebollado', image: 'assets/img/encebollado-1.jpg', region: 'Costa' },
    { id: 2, name: 'Cuy Asado', image: 'assets/img/Cuy Asado.jpg', region: 'Sierra' },
    { id: 3, name: 'Ceviche', image: 'assets/img/ceviche-1.jpg', region: 'Costa' },
    { id: 4, name: 'Fritada', image: 'assets/img/fritada.jpg', region: 'Sierra' },
    { id: 5, name: 'Bolón de Verde', image: 'assets/img/bolones-1.jpg', region: 'Costa' },
    { id: 6, name: 'Colada Morada', image: 'assets/img/Colada Morada y Guagua de Pan.jpg', region: 'Sierra' },
  ]);

  // Computed: cantidad de platos guardados
  savedCount = computed(() => this.savedDishes().length);

  // Computed: verificar si tiene platos guardados
  hasSavedDishes = computed(() => this.savedDishes().length > 0);

  // Método para cerrar sesión
  logout(): void {
    // Por ahora solo limpia el estado
    // Después conectará con Firebase Auth
    console.log('Cerrando sesión...');
  }

  // Método para eliminar plato guardado
  removeSavedDish(id: number): void {
    const updated = this.savedDishes().filter(dish => dish.id !== id);
    this.savedDishes.set(updated);
  }

  // Método para cargar datos del usuario
  loadUserData(): void {
    this.isLoading.set(true);
    // Simulación de carga - después conectará con Firebase
    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

  // Método para marcar notificaciones como leídas
  markNotificationsAsRead(): void {
    this.hasNotifications.set(false);
  }
}