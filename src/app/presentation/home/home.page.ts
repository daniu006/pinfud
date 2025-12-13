import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  searchOutline, 
  personOutline, 
  homeOutline, 
  addOutline, 
  notificationsOutline 
} from 'ionicons/icons';

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
  hasNotifications: boolean = true;

  imageModalOpen: boolean = false;
  selectedItem: any = null;

  categories = [
    { id: 1, name: 'Para ti'},
    { id: 2, name: 'Costa' },
    { id: 3, name: 'Sierra' },
    { id: 4, name: 'Oriente' },
    { id: 5, name: 'Galapagos' },
  ];

  foodImages = [
    { 
      id: 1, 
      src: 'assets/img/bollo-de-pescado.jpg' 
    },
    { 
      id: 2,  
      src: 'assets/img/fritada.jpg' 
    },
    { 
      id: 3, 
      src: 'assets/img/bolones-1.jpg' 
    },
    { 
      id: 4, 
      src: 'assets/img/caldo-de-salchicha-1.jpg' 
    },
    { 
      id: 5, 
      src: 'assets/img/encebollado-1.jpg' 
    },
    { 
      id: 6, 
      src: 'assets/img/ceviche-1.jpg' 
    },
    { 
      id: 7,  
      src: 'assets/img/Cuy Asado.jpg' 
    },
    { 
      id: 8, 
      src: 'assets/img/chicha de jora.jpg' 
    },
    { 
      id: 9,  
      src: 'assets/img/corviche-1-1.jpg' 
    },
    { 
      id: 10,  
      src: 'assets/img/Colada Morada y Guagua de Pan.jpg' 
    }
  ];

  constructor(private navCtrl: NavController) {
    addIcons({
      'search-outline': searchOutline,
      'person-outline': personOutline,
      'home-outline': homeOutline,
      'add-outline': addOutline,
      'notifications-outline': notificationsOutline
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    console.log('Tab activo:', tab);
    
    // Aquí puedes agregar lógica de navegación si lo necesitas
    if (tab === 'notifications') {
      // Marca las notificaciones como leídas
      this.hasNotifications = false;
    }
  }

  selectCategory(categoryId: number) {
    this.selectedCategory = categoryId;
    console.log('Categoría seleccionada:', categoryId);
    
    // Aquí puedes filtrar las imágenes según la categoría
  }

  openItem(item: any) {
    this.selectedItem = item;
    this.imageModalOpen = true;
    console.log('Item seleccionado:', item);
    
    // Aquí puedes navegar a una página de detalle
    // this.navCtrl.navigateForward(`/detail/${item.id}`);
  }

  openSearch() {
    console.log('Abrir búsqueda');
    // Navega a la página de búsqueda
    // this.navCtrl.navigateForward('/search');
  }

  openProfile() {
    console.log('Abrir perfil');
    // Navega al perfil del usuario
    // this.navCtrl.navigateForward('/profile');
  }
}