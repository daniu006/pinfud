import { Injectable, signal, computed } from '@angular/core';

export interface SearchItem {
  id: number;
  name: string;
  image: string;
  region: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchViewModel {
  
  // Estado
  searchText = signal<string>('');
  isLoading = signal<boolean>(false);
  
  // Historial de búsquedas recientes (mock data por ahora)
  searchHistory = signal<SearchItem[]>([
    { id: 1, name: 'Encebollado', image: 'assets/img/encebollado-1.jpg', region: 'Costa' },
    { id: 2, name: 'Cuy Asado', image: 'assets/img/Cuy Asado.jpg', region: 'Sierra' },
    { id: 3, name: 'Ceviche', image: 'assets/img/ceviche-1.jpg', region: 'Costa' },
    { id: 4, name: 'Fritada', image: 'assets/img/fritada.jpg', region: 'Sierra' },
    { id: 5, name: 'Bolón de Verde', image: 'assets/img/bolones-1.jpg', region: 'Costa' },
    { id: 6, name: 'Colada Morada', image: 'assets/img/Colada Morada y Guagua de Pan.jpg', region: 'Sierra' },
  ]);

  // Resultados de búsqueda
  searchResults = signal<SearchItem[]>([]);

  // Computed: mostrar historial o resultados según si hay texto
  displayItems = computed(() => {
    const text = this.searchText().toLowerCase().trim();
    if (text === '') {
      return this.searchHistory();
    }
    return this.searchResults();
  });

  // Computed: verificar si hay texto de búsqueda
  hasSearchText = computed(() => this.searchText().trim().length > 0);

  // Método para actualizar texto de búsqueda
  updateSearchText(text: string): void {
    this.searchText.set(text);
    if (text.trim().length > 0) {
      this.performSearch(text);
    }
  }

  // Método para buscar (filtra del historial por ahora)
  private performSearch(query: string): void {
    this.isLoading.set(true);
    
    const filtered = this.searchHistory().filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.region.toLowerCase().includes(query.toLowerCase())
    );
    
    this.searchResults.set(filtered);
    this.isLoading.set(false);
  }

  // Método para eliminar item del historial
  removeFromHistory(id: number): void {
    const updated = this.searchHistory().filter(item => item.id !== id);
    this.searchHistory.set(updated);
  }

  // Método para limpiar búsqueda
  clearSearch(): void {
    this.searchText.set('');
    this.searchResults.set([]);
  }

  // Método para limpiar todo el historial
  clearAllHistory(): void {
    this.searchHistory.set([]);
  }
}