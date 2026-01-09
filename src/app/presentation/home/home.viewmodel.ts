import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeViewModel {
  // Estado actual
  selectedCategory: number = 1;
  hasNotifications: boolean = true;

  // Datos (Movidos desde home.page.ts)
  categories = [
    { id: 1, name: 'Para ti'},
    { id: 2, name: 'Costa' },
    { id: 3, name: 'Sierra' },
    { id: 4, name: 'Oriente' },
    { id: 5, name: 'Galapagos' },
  ];

  foodImages = [
    { id: 1, src: 'assets/img/bollo-de-pescado.jpg', categoryId: 2 },
    { id: 2, src: 'assets/img/fritada.jpg', categoryId: 3 },
    { id: 3, src: 'assets/img/bolones-1.jpg', categoryId: 2 },
    { id: 4, src: 'assets/img/caldo-de-salchicha-1.jpg', categoryId: 2 },
    { id: 5, src: 'assets/img/encebollado-1.jpg', categoryId: 2 },
    { id: 6, src: 'assets/img/ceviche-1.jpg', categoryId: 2 },
    { id: 7, src: 'assets/img/Cuy Asado.jpg', categoryId: 3 },
    { id: 8, src: 'assets/img/chicha de jora.jpg', categoryId: 3 },
    { id: 9, src: 'assets/img/corviche-1-1.jpg', categoryId: 2 },
    { id: 10, src: 'assets/img/Colada Morada y Guagua de Pan.jpg', categoryId: 3 }
  ];

  // Lista que se muestra en la UI
  filteredImages = [...this.foodImages];

  // Lógica de filtrado
  filterByCategory(categoryId: number) {
    this.selectedCategory = categoryId;
    if (categoryId === 1) {
      this.filteredImages = this.foodImages;
    } else {
      this.filteredImages = this.foodImages.filter(img => img.categoryId === categoryId);
    }
  }

  markNotificationsAsRead() {
    this.hasNotifications = false;
  }
}