
import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    addDoc,
    query,
    getDocs,
    orderBy,
    deleteDoc,
    doc,
    onSnapshot,
    updateDoc,
    where,
    limit
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface AppNotification {
    id: string;
    type: 'like' | 'comment' | 'follow' | 'system';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    icon: string;
    userImage?: string;
    fromUserId?: string;
    dishId?: string | number;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private firestore = inject(Firestore);

    constructor() { }

    /**
     * Add a notification for a specific user
     */
    async addNotification(userId: string, notification: Omit<AppNotification, 'id'>): Promise<void> {
        const notifCol = collection(this.firestore, `users/${userId}/notifications`);
        await addDoc(notifCol, {
            ...notification,
            timestamp: new Date().toISOString(),
            isRead: false
        });
    }

    /**
     * Get real-time notifications for a user
     */
    getNotifications$(userId: string): Observable<AppNotification[]> {
        const notifCol = collection(this.firestore, `users/${userId}/notifications`);
        const q = query(notifCol, orderBy('timestamp', 'desc'), limit(50));

        return new Observable(observer => {
            return onSnapshot(q, (snapshot) => {
                const notifications = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as AppNotification));
                observer.next(notifications);
            }, (error) => observer.error(error));
        });
    }

    /**
     * Mark a notification as read
     */
    async markAsRead(userId: string, notifId: string): Promise<void> {
        const notifRef = doc(this.firestore, `users/${userId}/notifications/${notifId}`);
        await updateDoc(notifRef, { isRead: true });
    }

    /**
     * Mark all as read
     */
    async markAllAsRead(userId: string): Promise<void> {
        const notifCol = collection(this.firestore, `users/${userId}/notifications`);
        const q = query(notifCol, where('isRead', '==', false));
        const snapshot = await getDocs(q);

        const promises = snapshot.docs.map(d =>
            updateDoc(doc(this.firestore, `users/${userId}/notifications/${d.id}`), { isRead: true })
        );
        await Promise.all(promises);
    }

    /**
     * Delete a notification
     */
    async deleteNotification(userId: string, notifId: string): Promise<void> {
        const notifRef = doc(this.firestore, `users/${userId}/notifications/${notifId}`);
        await deleteDoc(notifRef);
    }
}
