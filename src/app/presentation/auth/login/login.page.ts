import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { NavController } from '@ionic/angular/standalone';
import {
  logoGoogle,
  logoFacebook,
  logoTwitter
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonInput, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle]
})
export class LoginPage {

  constructor(private navCtrl: NavController) {

    addIcons({ logoGoogle, logoFacebook, logoTwitter });
  }
  goToHome() {
    this.navCtrl.navigateForward('/home', { replaceUrl: true });
  }

  goBack() {
    this.navCtrl.navigateBack('/welcome', { replaceUrl: true });



  }
}