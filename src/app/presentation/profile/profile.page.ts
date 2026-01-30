import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonFooter, IonSkeletonText } from '@ionic/angular/standalone';
import { NavController, ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  bookmarkOutline,
  personAddOutline,
  informationCircleOutline,
  logOutOutline,
  homeOutline,
  addOutline,
  notificationsOutline,
  images,
  camera
} from 'ionicons/icons';
import { ProfileViewModel, SavedDish } from './profile.viewmodel';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonFooter, IonSkeletonText, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit, ViewWillEnter {

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
      notificationsOutline,
      images,
      camera
    });
  }

  ionViewWillEnter(): void {
    this.vm.loadUserData();
  }

  ngOnInit(): void {
    this.vm.loadUserData();
  }

  async onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      await this.vm.updateAvatar(file);
    }
  }

  onDishClick(dish: SavedDish): void {
    console.log('Plato seleccionado desde perfil:', dish);
    this.navCtrl.navigateForward('/dish', {
      state: {
        dish: {
          id: dish.id,
          name: dish.name,
          image: dish.image,
          region: dish.region || 'Ecuador',
          description: '', // Descripciones no se guardan directamente en el Favorito simplificado
          isSaved: true
        }
      }
    });
  }

  onAddAccount(): void {
    this.navCtrl.navigateForward('/register');
  }

  onInfo(): void {
    console.log('Información');
    // Navegar a página de información
  }

  onGallery(): void {
    this.navCtrl.navigateForward('/gallery');
  }

  setActiveTab(tab: string): void {
    if (tab === 'home') {
      this.navCtrl.navigateRoot('/home');
    } else if (tab === 'add') {
      this.navCtrl.navigateForward('/upload');
    } else if (tab === 'notifications') {
      this.vm.markNotificationsAsRead();
      this.navCtrl.navigateForward('/notifications');
    }
  }

  onLogout(): void {
    this.vm.logout();
    this.navCtrl.navigateRoot('/welcome', { replaceUrl: true });
  }
}