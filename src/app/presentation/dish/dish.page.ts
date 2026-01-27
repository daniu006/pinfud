import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { DishViewModel, Dish } from './dish.viewmodel';
import { addIcons } from 'ionicons';
import { arrowBack, heart, heartOutline, shareOutline, downloadOutline, bookmark, bookmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-dish',
  templateUrl: './dish.page.html',
  styleUrls: ['./dish.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, CommonModule, FormsModule]
})
export class DishPage implements OnInit {

  constructor(
    public vm: DishViewModel,
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({ arrowBack, heart, heartOutline, shareOutline, downloadOutline, bookmark, bookmarkOutline });
  }

  ngOnInit() {
    // Obtener datos del plato desde el estado de navegación
    const navigation = this.router.getCurrentNavigation();
    const dish = navigation?.extras?.state?.['dish'] as Dish;

    if (dish) {
      this.vm.setDish(dish);
    } else {
      // Si no hay plato, volver atrás
      this.goBack('/home');
    }
  }

  goBack(route: string): void {
    this.router.navigate([route]);
  }

  onLike(): void {
    this.vm.toggleLike();
  }

  onShare(): void {
    this.vm.shareDish();
  }

  onDownload(): void {
    this.vm.downloadImage();
  }

  onSave(): void {
    this.vm.saveToFavorites();
  }
}
