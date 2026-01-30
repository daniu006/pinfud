import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController, ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  personOutline,
  homeOutline,
  addOutline,
  notificationsOutline
} from 'ionicons/icons';
import { HomeViewModel, FoodImage } from './home.viewmodel';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class HomePage implements ViewWillEnter {
  imageModalOpen: boolean = false;
  selectedItem: any = null;

  constructor(public vm: HomeViewModel, private nav: NavController) {
    addIcons({
      'search-outline': searchOutline,
      'person-outline': personOutline,
      'home-outline': homeOutline,
      'add-outline': addOutline,
      'notifications-outline': notificationsOutline
    });
  }

  // Recargar imágenes cuando se vuelve a mostrar la página
  ionViewWillEnter() {
    this.vm.loadAllImages();
  }

  selectCategory(id: number) {
    this.vm.filterByCategory(id);
  }

  setActiveTab(tab: string) {
    if (tab === 'notifications') {
      this.openNotifications();
    } else if (tab === 'add') {
      this.openAddImage();
    }
  }

  openAddImage() {
    this.nav.navigateForward('/upload');
  }

  openNotifications() {
    this.vm.markNotificationsAsRead();
    this.nav.navigateForward('/notifications');
  }

  openItem(item: FoodImage) {
    // Navegar a la página de detalle del plato
    this.nav.navigateForward('/dish', {
      state: {
        dish: {
          id: item.id,
          name: item.name || this.getDishNameById(item.id),
          image: item.src,
          region: this.getRegionName(item.categoryId),
          description: item.description,
          isUploaded: item.isUploaded,
          userId: item.userId
        }
      }
    });
  }

  // Obtener nombre del plato según ID
  private getDishNameById(id: string | number): string {
    if (typeof id === 'string') return 'Plato Compartido';

    const names: { [key: number]: string } = {
      1: 'Bollo de Pescado',
      2: 'Fritada',
      3: 'Bolón de Verde',
      4: 'Caldo de Salchicha',
      5: 'Encebollado',
      6: 'Ceviche',
      7: 'Cuy Asado',
      8: 'Chicha de Jora',
      9: 'Corviche',
      10: 'Colada Morada'
    };
    return names[id] || 'Plato Ecuatoriano';
  }

  // Obtener nombre de región según ID
  private getRegionName(categoryId: number): string {
    const regions: { [key: number]: string } = {
      1: 'Ecuador',
      2: 'Costa',
      3: 'Sierra',
      4: 'Oriente',
      5: 'Galápagos'
    };
    return regions[categoryId] || 'Ecuador';
  }

  // ESTAS SON LAS FUNCIONES QUE FALTABAN:
  openSearch() {
    this.nav.navigateForward('/search');
    console.log('Abriendo búsqueda...');
    // Aquí irá tu lógica de navegación después
  }

  openProfile() {
    this.nav.navigateForward('/profile');
    console.log('Abriendo perfil...');
    // Aquí irá tu lógica de navegación después
  }

}