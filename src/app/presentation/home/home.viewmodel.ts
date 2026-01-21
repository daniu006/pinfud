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
    { id: 1, name: 'Para ti' },
    { id: 2, name: 'Costa' },
    { id: 3, name: 'Sierra' },
    { id: 4, name: 'Oriente' },
    { id: 5, name: 'Galapagos' },
  ];

  foodImages = [
    { id: 1, src: 'assets/img/bolloPescado.jpg', categoryId: 2 },
    { id: 2, src: 'assets/img/fritada.jpg', categoryId: 3 },
    { id: 3, src: 'assets/img/bolones.jpg', categoryId: 2 },
    { id: 4, src: 'assets/img/caldoSalchicha.jpg', categoryId: 2 },
    { id: 5, src: 'assets/img/encebollado.jpg', categoryId: 2 },
    { id: 6, src: 'assets/img/ceviche.jpg', categoryId: 2 },
    { id: 7, src: 'assets/img/cuyAsado.jpg', categoryId: 3 },
    { id: 8, src: 'assets/img/chichaJora.jpg', categoryId: 3 },
    { id: 9, src: 'assets/img/corviche.jpg', categoryId: 2 },
    { id: 10, src: 'assets/img/coladaMorada.jpg', categoryId: 3 }
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