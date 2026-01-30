import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { NotificationService, AppNotification } from '../../core/services/notification.service';
import { Subscription } from 'rxjs';

export interface Notification {
    id: number;
    type: 'like' | 'comment' | 'follow' | 'system';
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    icon: string;
    userImage?: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationsViewModel implements OnDestroy {
    private auth = inject(Auth);
    private notificationService = inject(NotificationService);
    private sub: Subscription | null = null;

    // Señales
    notifications = signal<AppNotification[]>([]);
    hasUnread = signal<boolean>(false);

    constructor() {
        this.initNotificationListener();
    }

    private initNotificationListener(): void {
        authState(this.auth).subscribe(user => {
            if (user) {
                this.sub?.unsubscribe();
                this.sub = this.notificationService.getNotifications$(user.uid).subscribe(notifs => {
                    this.notifications.set(notifs);
                    this.updateUnreadStatus();
                });
            } else {
                this.notifications.set([]);
                this.hasUnread.set(false);
                this.sub?.unsubscribe();
            }
        });
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    // Marcar todas como leídas
    async markAllAsRead(): Promise<void> {
        const user = this.auth.currentUser;
        if (!user) return;
        await this.notificationService.markAllAsRead(user.uid);
    }

    // Marcar una notificación como leída
    async markAsRead(id: string): Promise<void> {
        const user = this.auth.currentUser;
        if (!user) return;
        await this.notificationService.markAsRead(user.uid, id);
    }

    // Eliminar notificación
    async deleteNotification(id: string): Promise<void> {
        const user = this.auth.currentUser;
        if (!user) return;
        await this.notificationService.deleteNotification(user.uid, id);
    }

    // Actualizar estado de no leídas
    private updateUnreadStatus(): void {
        const hasUnread = this.notifications().some(n => !n.isRead);
        this.hasUnread.set(hasUnread);
    }

    // Formatear tiempo relativo
    getRelativeTime(timestamp: string): string {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} d`;
        return date.toLocaleDateString('es-EC');
    }

    // Obtener color según tipo
    getNotificationColor(type: string): string {
        const colors: { [key: string]: string } = {
            'like': '#ff3b30',
            'comment': '#007aff',
            'follow': '#34c759',
            'system': '#4E070C'
        };
        return colors[type] || '#999';
    }
}
