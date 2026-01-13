import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { IonicModule, ToastController } from '@ionic/angular';
import { RegisterViewModel } from './register.viewmodel';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class RegisterPage {

  constructor(
    private navCtrl: NavController,
    public vm: RegisterViewModel,
    private toastCtrl: ToastController
  ) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  goTologin() {
    this.navCtrl.navigateBack('/login', { replaceUrl: true });
  }

  async onRegister() {
    const success = await this.vm.register();
    if (success) {
      this.showToast('¡Cuenta creada correctamente!', 'success');
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
}
