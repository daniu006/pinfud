import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule   
  ]
})
export class HomePage {

  activeTab: string = 'home';
  selectedCategory: number = 1;

  imageModalOpen: boolean = false;
  selectedItem: any = null;

  categories = [
    { id: 1, name: 'Para ti'},
    { id: 2, name: 'Costa' },
    { id: 3, name: 'Sierra' },
    { id: 4, name: 'Oriente' },
    { id: 5, name: 'Galapagos' },
   
  ];

  foodItems = [
    { id: 1, title: 'Pizza Pep', price: '$12.99', rating: 4.8, height: 240, image: '🍕' },
    { id: 2, title: 'Burguer King', price: '$8.50', rating: 4.6, height: 280, image: '🍔' },
    { id: 3, title: 'Sushi Rolls', price: '$15.20', rating: 4.9, height: 210, image: '🍣' },
    { id: 4, title: 'Cupcakes', price: '$6.00', rating: 4.5, height: 260, image: '🧁' },
    { id: 5, title: 'Pollo BBQ', price: '$10.50', rating: 4.7, height: 230, image: '🍗' },
  ];

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  selectCategory(categoryId: number) {
    this.selectedCategory = categoryId;
  }

  openItem(item: any) {
    this.selectedItem = item;
    this.imageModalOpen = true;
  }
}
