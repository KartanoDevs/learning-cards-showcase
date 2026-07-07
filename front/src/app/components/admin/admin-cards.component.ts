import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

// Servicios y Modelos
import { CardsService } from '../../api/cards.service';
import { GroupsService } from '../../api/groups.service';
import { Group, Card } from '../../api/models';

// Módulos PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';

// Componentes compartidos
import { CustomPaginatorComponent } from '../shared/custom-paginator/custom-paginator.component';

@Component({
  selector: 'app-admin-cards',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    ToastModule,
    RippleModule,
    DropdownModule,
    OverlayPanelModule,
    TooltipModule,
    TooltipModule,
    CustomPaginatorComponent,
    RouterModule
  ],
  templateUrl: './admin-cards.component.html',
  styleUrls: ['./admin-cards.component.css'],
  providers: [MessageService]
})
export class AdminCardsComponent implements OnInit {

  @ViewChild('pTable') pTable!: Table;
  @ViewChild('imagePreviewPanel') imagePreviewPanel!: OverlayPanel;

  private cardsService = inject(CardsService);
  private groupsService = inject(GroupsService);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject( Router );

  // Estado del componente
  allCards: Card[] = [];
  filteredCards: Card[] = [];
  paginatedCards: Card[] = [];
  groups: Group[] = [];
  clonedCards: { [s: string]: Card } = {};

  isAddingNewRow: boolean = false;
  searchTerm: string = '';
  initialGroupIdFilter: string | null = null;
  imageForPreview: string | null = null;

  // Paginación
  rows: number = 30;
  currentPage: number = 1;

  get totalRecords(): number {
    return this.filteredCards.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.rows);
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.initialGroupIdFilter = params.get('groupId');
      this.loadInitialData();
    });
  }

  loadInitialData(): void {
    // Cargamos tanto las tarjetas como los grupos para el dropdown
    this.groupsService.list().subscribe(allGroups => {
      if (this.initialGroupIdFilter) {
        // Si la vista está filtrada, el dropdown solo debe mostrar ese grupo
        this.groups = allGroups.filter(g => g._id === this.initialGroupIdFilter);
      } else {
        this.groups = allGroups;
      }
    });
    this.loadCards(this.initialGroupIdFilter);
  }

  loadCards(groupId?: string | null): void {
    // Pedimos todas las tarjetas (con un límite alto)
    const options: any = { limit: 9999 };
    if (groupId) options.groupId = groupId;

    this.cardsService.list(options).subscribe({
      next: ({ data }) => {
        this.allCards = data;
        this.filterCards();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las tarjetas' });
      }
    });
  }

  filterCards(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredCards = this.initialGroupIdFilter
        ? this.allCards.filter(c => c.groupId === this.initialGroupIdFilter)
        : [...this.allCards];
    } else {
      let cardsToFilter = this.initialGroupIdFilter
        ? this.allCards.filter(c => c.groupId === this.initialGroupIdFilter)
        : this.allCards;

      this.filteredCards = cardsToFilter.filter(card =>
          card.english.toLowerCase().includes(term) ||
          card.spanish.toLowerCase().includes(term)
        );
    }
    this.currentPage = 1;
    this.updatePaginatedView();
  }

  private updatePaginatedView(): void {
    const startIndex = (this.currentPage - 1) * this.rows;
    const endIndex = startIndex + this.rows;
    this.paginatedCards = this.filteredCards.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updatePaginatedView();
  }

  viewTopicCards(): void
  {
    if ( !this.initialGroupIdFilter )
    {
      return;
    }
    // Mismo patrón que ListGroupsPage.selectGroup
    this.router.navigate( [ '/list-cards', this.initialGroupIdFilter ] );
  }

  onRowEditInit(card: Card) {
    this.clonedCards[card._id] = { ...card };
  }

  addNewCardRow() {
    if (this.isAddingNewRow) return;
    this.isAddingNewRow = true;

    this.searchTerm = '';
    this.pTable.reset();
    this.filterCards();

    this.currentPage = 1;
    const tempId = `_new_${Date.now()}`;
    const newCard: Card = {
      _id: tempId,
      english: '',
      spanish: '',
      groupId: this.initialGroupIdFilter ?? (this.groups[0]?._id ?? ''), // Asigna el grupo filtrado o el primero por defecto
      order: 0,
      enabled: true,
      imageUrl: ''
    };

    this.allCards.unshift(newCard);
    this.filteredCards.unshift(newCard);
    this.updatePaginatedView();

    setTimeout(() => {
      this.pTable.initRowEdit(newCard);
      this.onRowEditInit(newCard);
    }, 0);
  }

  manualSave(card: Card, index: number) {
    const isNew = card._id.startsWith('_new_');

    if (!card.english || !card.spanish || !card.groupId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Inglés, Español y Tema son obligatorios' });
      return;
    }

    if (isNew) {
      const payload: Omit<Card, '_id'> = {
        english: card.english,
        spanish: card.spanish,
        groupId: card.groupId,
        order: card.order,
        enabled: card.enabled,
        imageUrl: card.imageUrl
      };
      this.cardsService.create(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarjeta creada' });
          this.isAddingNewRow = false;
          this.loadCards(); // Recargamos todo
        },
        error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.message || 'No se pudo crear la tarjeta' })
      });
    } else {
      const originalCard = this.clonedCards[card._id];
      const payload: Partial<Card> = {};
      if (originalCard.english !== card.english) payload.english = card.english;
      if (originalCard.spanish !== card.spanish) payload.spanish = card.spanish;
      if (originalCard.groupId !== card.groupId) payload.groupId = card.groupId;
      if ( originalCard.order !== card.order ) payload.order = card.order;
      if (originalCard.imageUrl !== card.imageUrl) payload.imageUrl = card.imageUrl;

      if (Object.keys(payload).length > 0) {
        this.cardsService.update(card._id, payload).subscribe({
          next: (updatedCard) => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarjeta actualizada' });
            Object.assign(this.allCards.find(c => c._id === card._id)!, updatedCard);
            this.filterCards();
            this.pTable.cancelRowEdit(card);
            delete this.clonedCards[card._id];
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la tarjeta' });
            this.manualCancel(card, index);
          }
        });
      } else {
        this.pTable.cancelRowEdit(card);
        delete this.clonedCards[card._id];
      }
    }
  }

  manualCancel(card: Card, index: number) {
    if (card._id.startsWith('_new_')) {
      this.allCards.shift();
      this.filterCards();
      this.isAddingNewRow = false;
    } else {
      const original = this.clonedCards[card._id];
      if (original) {
        Object.assign(this.allCards.find(c => c._id === card._id)!, original);
        this.filterCards();
      }
      this.pTable.cancelRowEdit(card);
    }
    delete this.clonedCards[card._id];
  }

  toggleCardStatus(card: Card): void {
    const action = card.enabled ? this.cardsService.hide(card._id) : this.cardsService.show(card._id);
    action.subscribe({
      next: (updatedCard) => {
        card.enabled = updatedCard.enabled;
        this.messageService.add({ severity: 'info', summary: 'Actualizado', detail: 'Visibilidad cambiada' });
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cambiar la visibilidad' })
    });
  }

  showImagePreview(event: MouseEvent, imageUrl: string): void {
    this.imageForPreview = imageUrl;
    this.imagePreviewPanel.toggle(event);
  }

  // Helper para mostrar el nombre del grupo en la tabla
  getGroupName(groupId: string): string {
    return this.groups.find(g => g._id === groupId)?.name ?? 'N/A';
  }
}
