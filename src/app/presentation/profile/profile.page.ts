import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonFooter } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bookmarkOutline,
  personAddOutline,
  informationCircleOutline,
  logOutOutline,
  homeOutline,
  addOutline,
  notificationsOutline
} from 'ionicons/icons';
import { ProfileViewModel, SavedDish } from './profile.viewmodel';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonFooter, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {

  vm = inject(ProfileViewModel);
  private navCtrl = inject(NavController);

  constructor() {
    addIcons({
      bookmarkOutline,
      personAddOutline,
      informationCircleOutline,
      logOutOutline,
      homeOutline,
      addOutline,
      notificationsOutline
    });
  }

  ngOnInit(): void {
    this.vm.loadUserData();
  }

  onDishClick(dish: SavedDish): void {
    console.log('Plato seleccionado:', dish);
    // this.navCtrl.navigateForward(`/dish/${dish.id}`);
  }

  onAddAccount(): void {
    console.log('Agregar cuenta');
    // Lógica para agregar otra cuenta
  }

  onInfo(): void {
    console.log('Información');
    // Navegar a página de información
  }

  setActiveTab(tab: string): void {
    if (tab === 'home') {
      this.navCtrl.navigateRoot('/home');
    } else if (tab === 'add') {
      console.log('Agregar nuevo plato...');
      // Aquí irá la lógica para agregar plato
    } else if (tab === 'notifications') {
      this.vm.markNotificationsAsRead();
      console.log('Abriendo notificaciones...');
      // Aquí irá la navegación a notificaciones
    }
  }

  onLogout(): void {
    this.vm.logout();
    this.navCtrl.navigateRoot('/welcome', { replaceUrl: true });
  }
}