import { Component, OnInit, HostListener, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

// PrimeNG Modules [2]
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

// --- MOCK INTERFACES (Asumidas de la estructura DB/Backend) ---
interface Card {
  _id: string;
  groupId: string;
  term: string; // Ej: "silla" [7]
  definition: string; // Ej: "chair" [8]
  category: string; // Ej: "Mueble"
}

// --- MOCK SERVICE (Simulación de la conexión al backend) ---
class CardService {
  private mockCards: Card[] = [
    { _id: 'c1', groupId: '668a6f9f8c14d9b7f03a1a10', term: 'silla', definition: 'chair', category: 'Mueble' },
    { _id: 'c2', groupId: '668a6f9f8c14d9b7f03a1a10', term: 'mesa', definition: 'table', category: 'Mueble' },
    { _id: 'c3', groupId: '668a6f9f8c14d9b7f03a1a10', term: 'pizarra', definition: 'blackboard', category: 'Herramienta de Aula' },
    { _id: 'c4', groupId: '668a6f9f8c14d9b7f03a1a10', term: 'ventana', definition: 'window', category: 'Elemento' },
    // Tarjetas de otro grupo (para simular carga dinámica)
    { _id: 'c5', groupId: '668a6f9f8c14d9b7f03a1a11', term: 'armario', definition: 'cupboard', category: 'Mueble' },
  ];

  fetchCardsByGroup(groupId: string): Card[] {
    // Simulación de filtro: Solo devuelve las tarjetas para el groupId
    return this.mockCards.filter(c => c.groupId === groupId);
  }
}

@Component({
  selector: 'app-card-view',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RippleModule],
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.css'],
  providers: [CardService]
})
export class CardViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cardService = inject(CardService);

  // Estado de las tarjetas
  cards = signal<Card[]>([]);
  currentIndex = signal<number>(0);
  isFlipped = signal<boolean>(false); // Estado para el efecto 3D

  // Tarjeta actual es una Signal computada
  currentCard = computed(() => {
    const cards = this.cards();
    const index = this.currentIndex();
    return cards.length > 0 ? cards[index] : null;
  });

  ngOnInit(): void {
    // Escuchar cambios en los parámetros de la ruta para cargar el grupo correcto
    this.route.paramMap.subscribe(params => {
      const groupId = params.get('groupId');
      if (groupId) {
        this.loadCards(groupId);
      }
    });
  }

  loadCards(groupId: string): void {
    const fetchedCards = this.cardService.fetchCardsByGroup(groupId);
    this.cards.set(fetchedCards);
    this.currentIndex.set(0); // Reiniciar al primer elemento
    this.isFlipped.set(false);
  }

  // HOST LISTENER: Captura de eventos de teclado
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.cards().length === 0) return;

    if (event.key === 'ArrowRight') {
      this.nextCard();
      event.preventDefault(); // Opcional: prevenir scroll horizontal
    } else if (event.key === 'ArrowLeft') {
      this.prevCard();
      event.preventDefault();
    } else if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      this.flipCard();
    }
  }

  flipCard(): void {
    this.isFlipped.update(flipped => !flipped);
  }

  nextCard(): void {
    this.currentIndex.update(index =>
      (index + 1) % this.cards().length // Ciclo infinito: 0, 1, 2, 0, 1...
    );
    this.isFlipped.set(false);
  }

  prevCard(): void {
    this.currentIndex.update(index => {
      const newIndex = index - 1;
      // Ciclo infinito: 2, 1, 0, 2, 1...
      return newIndex < 0 ? this.cards().length - 1 : newIndex;
    });
    this.isFlipped.set(false);
  }

  /**
   * Muestra una tarjeta completamente al azar (no secuencial)
   */
  shuffleCard(): void {
    const length = this.cards().length;
    if (length <= 1) return;

    let newIndex: number;
    do {
      // Generar índice aleatorio (0 hasta length - 1)
      newIndex = Math.floor(Math.random() * length);
    } while (newIndex === this.currentIndex()); // Asegura que sea diferente a la actual

    this.currentIndex.set(newIndex);
    this.isFlipped.set(false);
  }
}
