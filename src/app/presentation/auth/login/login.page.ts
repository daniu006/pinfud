import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { LoginViewModel } from './login.viewmodel';
import { addIcons } from 'ionicons';
import {
  logoGoogle,
  logoFacebook,
  logoTwitter,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class loginPage {

  constructor(
    public vm: LoginViewModel,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    addIcons({
      logoGoogle,
      logoFacebook,
      logoTwitter,
      eyeOutline,
      eyeOffOutline
    });
  }

  async onLogin() {
    const success = await this.vm.login();
    if (success) {
      this.showToast('¡Bienvenido de nuevo!', 'success');
      this.navCtrl.navigateRoot('/home');
    } else {
      this.showToast(this.vm.errorMessage, 'danger');
    }
  }

  async onLoginGoogle() {
    const success = await this.vm.loginWithGoogle();
    if (success) {
      this.showToast('¡Bienvenido de Google!', 'success');
      this.navCtrl.navigateRoot('/home');
    } else {
      this.showToast(this.vm.errorMessage, 'danger');
    }
  }

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      color: color,
      icon: color === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'
    });
    await toast.present();
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}