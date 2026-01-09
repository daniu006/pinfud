import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, closeOutline } from 'ionicons/icons';
import { SearchViewModel, SearchItem } from './search.viewmodel';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, FormsModule]
})
export class SearchPage {

  vm = inject(SearchViewModel);
  private navCtrl = inject(NavController);

  constructor() {
    addIcons({ searchOutline, closeOutline });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.vm.updateSearchText(input.value);
  }

  onCancel(): void {
    this.vm.clearSearch();
    this.navCtrl.back();
  }

  onItemClick(item: SearchItem): void {
    // Navegar al detalle del plato
    console.log('Item seleccionado:', item);
    // this.navCtrl.navigateForward(`/dish/${item.id}`);
  }

  onRemoveItem(event: Event, id: number): void {
    event.stopPropagation(); // Evitar que se dispare onItemClick
    this.vm.removeFromHistory(id);
  }
}