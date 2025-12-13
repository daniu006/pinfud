import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonImg]
})
export class WelcomePage implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {  }

  goToLogin() {
    this.router.navigate(['/login',]);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  } 

}
