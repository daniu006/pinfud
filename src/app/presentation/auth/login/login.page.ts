import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { LoginViewModel } from './login.viewmodel';
import { addIcons } from 'ionicons';
import {
  logoGoogle,
  logoFacebook,
  logoTwitter,
  checkmarkCircle,
  alertCircle,
  mail
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class loginPage {

  constructor(public vm: LoginViewModel, private navCtrl: NavController) {
    addIcons({
      logoGoogle,
      logoFacebook,
      logoTwitter,
      checkmarkCircle,
      alertCircle,
      mail
    });
  }

  async onLogin() {
    const success = await this.vm.login();
    if (success) {
      this.navCtrl.navigateRoot('/home');
    }
  }

  async onGoogleLogin() {
    const success = await this.vm.loginWithGoogle();
    if (success) {
      this.navCtrl.navigateRoot('/home');
    }
  }

  async onFacebookLogin() {
    const success = await this.vm.loginWithFacebook();
    if (success) {
      this.navCtrl.navigateRoot('/home');
    }
  }

  async onTwitterLogin() {
    const success = await this.vm.loginWithTwitter();
    if (success) {
      this.navCtrl.navigateRoot('/home');
    }
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}