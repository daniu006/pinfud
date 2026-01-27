import { Injectable, signal } from '@angular/core';

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
export class NotificationsViewModel {

    // Señales
    notifications = signal<Notification[]>([]);
    hasUnread = signal<boolean>(true);

    constructor() {
        this.loadNotifications();
    }

    // Cargar notificaciones (mock data, listo para Firebase)
    private loadNotifications(): void {
        const mockNotifications: Notification[] = [
            {
                id: 1,
                type: 'like',
                title: 'Nuevo me gusta',
                message: 'A María le gustó tu foto de Encebollado',
                timestamp: new Date(Date.now() - 1000 * 60 * 5), // hace 5 minutos
                isRead: false,
                icon: 'heart',
                userImage: 'assets/img/gato.jpeg'
            },
            {
                id: 2,
                type: 'comment',
                title: 'Nuevo comentario',
                message: 'Juan comentó: "¡Se ve delicioso!"',
                timestamp: new Date(Date.now() - 1000 * 60 * 30), // hace 30 minutos
                isRead: false,
                icon: 'chatbubble',
                userImage: 'assets/img/gato.jpeg'
            },
            {
                id: 3,
                type: 'follow',
                title: 'Nuevo seguidor',
                message: 'Ana comenzó a seguirte',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // hace 2 horas
                isRead: false,
                icon: 'person-add',
                userImage: 'assets/img/gato.jpeg'
            },
            {
                id: 4,
                type: 'system',
                title: 'Bienvenido a Pinfüd',
                message: 'Explora los mejores platos de Ecuador',
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // hace 1 día
                isRead: true,
                icon: 'notifications'
            }
        ];

        this.notifications.set(mockNotifications);
        this.updateUnreadStatus();
    }

    // Marcar todas como leídas
    markAllAsRead(): void {
        this.notifications.update(notifications =>
            notifications.map(n => ({ ...n, isRead: true }))
        );
        this.updateUnreadStatus();
    }

    // Marcar una notificación como leída
    markAsRead(id: number): void {
        this.notifications.update(notifications =>
            notifications.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            )
        );
        this.updateUnreadStatus();
    }

    // Eliminar notificación
    deleteNotification(id: number): void {
        this.notifications.update(notifications =>
            notifications.filter(n => n.id !== id)
        );
        this.updateUnreadStatus();
    }

    // Actualizar estado de no leídas
    private updateUnreadStatus(): void {
        const hasUnread = this.notifications().some(n => !n.isRead);
        this.hasUnread.set(hasUnread);
    }

    // Formatear tiempo relativo
    getRelativeTime(date: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `Hace ${diffDays} días`;
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
