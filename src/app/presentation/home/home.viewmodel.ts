import { Injectable } from '@angular/core';

export interface FoodImage {
  id: number;
  src: string;
  categoryId: number;
  name?: string;
  description?: string;
  isUploaded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HomeViewModel {
  // Estado actual
  selectedCategory: number = 1;
  hasNotifications: boolean = true;

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

  // Lista combinada (subidas + estáticas)
  foodImages: FoodImage[] = [];

  // Lista que se muestra en la UI
  filteredImages: FoodImage[] = [];

  constructor() {
    this.loadAllImages();
  }

  // Cargar todas las imágenes incluyendo las subidas
  loadAllImages() {
    const uploadedDishes = this.getUploadedDishes();
    // Combinar subidas (primero) + estáticas
    this.foodImages = [...uploadedDishes, ...this.staticImages];
    this.filterByCategory(this.selectedCategory);
  }

  // Obtener platos subidos desde localStorage
  private getUploadedDishes(): FoodImage[] {
    try {
      const saved = localStorage.getItem('uploadedDishes');
      if (!saved) return [];

      const dishes = JSON.parse(saved);

      // Eliminar duplicados por imagen (misma URL base64)
      const uniqueDishes: any[] = [];
      const seenImages = new Set<string>();

      for (const dish of dishes) {
        // Usar los primeros 100 caracteres de la imagen como identificador
        const imageKey = dish.image?.substring(0, 100);
        if (imageKey && !seenImages.has(imageKey)) {
          seenImages.add(imageKey);
          uniqueDishes.push(dish);
        }
      }

      return uniqueDishes.map((dish: any, index: number) => ({
        id: 1000 + index,
        src: dish.image,
        categoryId: this.regionToCategoryId[dish.region] || 1,
        name: dish.name,
        description: dish.description,
        isUploaded: true
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
    this.hasNotifications = false;
  }
}