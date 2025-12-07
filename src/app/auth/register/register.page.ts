import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonInput, IonButton} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput, IonButton]
})
export class RegisterPage {

  constructor(private navCtrl: NavController ) { }
   
  goTologin(){
    this.navCtrl.navigateBack('/welcome', {replaceUrl:true});
  }

  goTohome(){
    this.navCtrl.navigateBack('/home', {replaceUrl:true});
  }
}
