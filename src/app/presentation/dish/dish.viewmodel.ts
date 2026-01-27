import { Injectable, signal } from '@angular/core';

export interface Dish {
    id: number;
    name: string;
    image: string;
    region: string;
}

@Injectable({
    providedIn: 'root'
})
export class DishViewModel {

    // Estado del plato actual
    currentDish = signal<Dish | null>(null);

    // Estado de "me gusta"
    isLiked = signal<boolean>(false);

    // Estado de guardado
    isSaved = signal<boolean>(false);

    constructor() { }

    // Establecer el plato actual
    setDish(dish: Dish): void {
        this.currentDish.set(dish);
        // Aquí podrías verificar si ya está en favoritos
        this.checkIfSaved(dish.id);
    }

    // Toggle de "me gusta"
    toggleLike(): void {
        this.isLiked.update(liked => !liked);
        console.log('Like toggled:', this.isLiked());
        // Aquí conectarás con Firebase o backend
    }

    // Compartir plato
    async shareDish(): Promise<void> {
        const dish = this.currentDish();
        if (!dish) return;

        console.log('Compartiendo plato:', dish.name);

        // Implementación con Web Share API
        if (navigator.share) {
            try {
                await navigator.share({
                    title: dish.name,
                    text: `Mira este delicioso plato: ${dish.name} de la región ${dish.region}`,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Error al compartir:', error);
            }
        } else {
            // Fallback: copiar al portapapeles
            console.log('Web Share API no disponible');
        }
    }

    // Descargar imagen
    async downloadImage(): Promise<void> {
        const dish = this.currentDish();
        if (!dish) return;

        console.log('Descargando imagen:', dish.image);

        try {
            // Crear un enlace temporal para descargar
            const link = document.createElement('a');
            link.href = dish.image;
            link.download = `${dish.name}.jpg`;
            link.click();
        } catch (error) {
            console.error('Error al descargar:', error);
        }
    }

    // Guardar en favoritos
    saveToFavorites(): void {
        const dish = this.currentDish();
        if (!dish) return;

        this.isSaved.update(saved => !saved);
        console.log('Guardado en favoritos:', this.isSaved());

        // Aquí guardarás en Firebase o localStorage
        if (this.isSaved()) {
            this.addToFavorites(dish);
        } else {
            this.removeFromFavorites(dish.id);
        }
    }

    // Verificar si está guardado
    private checkIfSaved(dishId: number): void {
        // Aquí verificarías en Firebase o localStorage
        // Por ahora, simulación
        const savedDishes = this.getSavedDishes();
        this.isSaved.set(savedDishes.some(d => d.id === dishId));
    }

    // Agregar a favoritos (simulado)
    private addToFavorites(dish: Dish): void {
        const saved = this.getSavedDishes();
        saved.push(dish);
        localStorage.setItem('savedDishes', JSON.stringify(saved));
    }

    // Remover de favoritos (simulado)
    private removeFromFavorites(dishId: number): void {
        const saved = this.getSavedDishes();
        const filtered = saved.filter(d => d.id !== dishId);
        localStorage.setItem('savedDishes', JSON.stringify(filtered));
    }

    // Obtener platos guardados
    private getSavedDishes(): Dish[] {
        const saved = localStorage.getItem('savedDishes');
        return saved ? JSON.parse(saved) : [];
    }
}
