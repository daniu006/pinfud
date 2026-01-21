import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { RegisterViewModel } from './register.viewmodel'; // Importamos el VM

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class RegisterPage {

  constructor(
    public vm: RegisterViewModel, // Inyectamos el VM
    private navCtrl: NavController
  ) { }
   
  goTologin() {
    this.navCtrl.navigateBack('/welcome', { replaceUrl: true });
  }

  // Adaptación del método original usando el VM
  async goTohome() {
    const success = await this.vm.executeRegister();
    if (success) {
      this.navCtrl.navigateRoot('/home', { replaceUrl: true });
    }
  }
}