import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  personOutline,
  homeOutline,
  addOutline,
  notificationsOutline
} from 'ionicons/icons';
import { HomeViewModel } from './home.viewmodel';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class HomePage {
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

  selectCategory(id: number) {
    this.vm.filterByCategory(id);
  }

  setActiveTab(tab: string) {
    if (tab === 'notifications') {
      this.vm.markNotificationsAsRead();
    }
  }

  openItem(item: any) {
    this.selectedItem = item;
    this.imageModalOpen = true;
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