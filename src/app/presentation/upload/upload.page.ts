import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UploadViewModel } from './upload.viewmodel';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  cameraOutline,
  imagesOutline,
  closeCircle,
  checkmarkCircle
} from 'ionicons/icons';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule
  ]
})
export class UploadPage implements OnInit {

  constructor(
    public vm: UploadViewModel,
    private router: Router
  ) {
    addIcons({
      arrowBack,
      cameraOutline,
      imagesOutline,
      closeCircle,
      checkmarkCircle
    });
  }

  ngOnInit() {
    // Resetear formulario al entrar
    this.vm.resetForm();
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  async takePhoto() {
    await this.vm.takePhoto();
  }

  async selectFromGallery() {
    await this.vm.selectFromGallery();
  }

  removeImage() {
    this.vm.selectedImage.set(null);
  }

  async submitDish() {
    const success = await this.vm.uploadDish();
    if (success) {
      // Mostrar mensaje de éxito y volver al home
      this.router.navigate(['/home']);
    }
  }

  updateDishName(event: any) {
    this.vm.dishName.set(event.target.value);
  }

  updateRegion(event: any) {
    this.vm.selectedRegion.set(event.detail.value);
  }

  updateDescription(event: any) {
    this.vm.description.set(event.target.value);
  }
}
