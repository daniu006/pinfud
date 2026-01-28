import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { RegisterViewModel } from './register.viewmodel';
import { addIcons } from 'ionicons';
import { checkmarkCircle, alertCircle, mail } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class RegisterPage {

  constructor(
    public vm: RegisterViewModel,
    private navCtrl: NavController
  ) {
    addIcons({ checkmarkCircle, alertCircle, mail });
  }

  goToLogin() {
    this.navCtrl.navigateBack('/login', { replaceUrl: true });
  }

  // Método para ejecutar registro con Firebase
  async onRegister() {
    const success = await this.vm.executeRegister();
    // No navegamos al home automáticamente, mostramos mensaje de verificación
    // El usuario debe verificar su email primero
  }
}