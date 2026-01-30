import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NotificationsViewModel } from './notifications.viewmodel';
import { addIcons } from 'ionicons';
import {
    arrowBack,
    heart,
    chatbubble,
    personAdd,
    notifications,
    trashOutline,
    checkmarkDone
} from 'ionicons/icons';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.page.html',
    styleUrls: ['./notifications.page.scss'],
    standalone: true,
    imports: [IonContent, IonIcon, CommonModule, FormsModule]
})
export class NotificationsPage implements OnInit {

    constructor(
        public vm: NotificationsViewModel,
        private router: Router
    ) {
        addIcons({
            arrowBack,
            heart,
            chatbubble,
            personAdd,
            notifications,
            trashOutline,
            checkmarkDone
        });
    }

    ngOnInit() {
        // Marcar todas como leídas al entrar
        setTimeout(() => {
            this.vm.markAllAsRead();
        }, 500);
    }

    goBack() {
        this.router.navigate(['/home']);
    }

    onNotificationClick(id: string) {
        this.vm.markAsRead(id);
    }

    deleteNotification(event: Event, id: string) {
        event.stopPropagation();
        this.vm.deleteNotification(id);
    }

    markAllAsRead() {
        this.vm.markAllAsRead();
    }
}
