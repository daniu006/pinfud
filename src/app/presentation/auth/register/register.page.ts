import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule,FormsModule,CommonModule]
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
