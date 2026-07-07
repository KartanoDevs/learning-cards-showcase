import { Card } from './../../api/models';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';

import {
  BehaviorSubject,
  Subject,
  combineLatest,
  switchMap,
  map,
  catchError,
  of,
  takeUntil,
  fromEvent,
  tap,
} from 'rxjs';
import { CardsService } from '../../api/cards.service';
import { GroupsService } from '../../api/groups.service';
import type { PaginationMeta } from './../../api/models';
import { CardComponent } from '../../components/main/card/card.component';
import { CustomPaginatorComponent } from '../../components/shared/custom-paginator/custom-paginator.component';
// --- 1. IMPORTAR EL NUEVO COMPONENTE ---

@Component({
  selector: 'app-list-cards',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    MessageModule,
    DialogModule,
    CardComponent,
    CustomPaginatorComponent
  ],
  templateUrl: './list-cards.page.html',
  styleUrls: ['./list-cards.page.css'],
})
export class ListCardsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private cardsSrv = inject(CardsService);
  private groupsSrv = inject( GroupsService );
  private destroy$ = new Subject<void>();

  loading = false;
  error: string | null = null;

  groupId = '';
  groupName = ''; // <-- Nombre del grupo
  cards: Card[] = [];
  meta!: PaginationMeta;

  readonly limit = 1;

  private page$ = new BehaviorSubject<number>(1);
  private shuffle$ = new BehaviorSubject<boolean>(false);
  private reverse$ = new BehaviorSubject<boolean>(false);

  get page() { return this.page$.value; }
  get shuffle() { return this.shuffle$.value; }
  get reverse() { return this.reverse$.value; }

  showImage = false;
  modalImageUrl: string | null = null;

  ngOnInit(): void {
    // 1. Obtener nombre del grupo (Independiente de la carga de cartas)
    this.route.paramMap
      .pipe(
        map( ( pm ) => pm.get( 'id' ) ?? '' ),
        switchMap( ( id ) =>
        {
          // No bloqueamos 'loading' aquí.
          return this.groupsSrv.getById( id ).pipe(
            tap( ( g ) => console.log( '🔥 [ListCards] Grupo recibido:', g ) ),
            catchError( ( err ) =>
            {
              console.error( '❌ [ListCards] Error obteniendo grupo:', err );
              return of( null );
            } )
          );
        } ),
        takeUntil( this.destroy$ )
      )
      .subscribe( ( group ) =>
      {
        if ( group )
        {
          this.groupName = group.name;
        }
      } );

    // 2. Cargar cartas (Mantiene lógica original)
    combineLatest([
      this.route.paramMap.pipe(map((pm) => pm.get('id') ?? '')),
      this.page$,
      this.shuffle$,
      this.reverse$,
    ])
      .pipe(
        switchMap(([id, page, shuffle, reverse]) => {
          this.groupId = id;
          this.loading = true;
          this.error = null;
          return this.cardsSrv
            .list({
              groupId: id,
              enabled: true,
              page,
              limit: this.limit,
              shuffle,
              reverse,
            })
            .pipe(
              catchError((err) => {
                console.error(err);
                this.error = 'No se pudieron cargar las tarjetas.';
                const fallbackMeta: PaginationMeta = {
                  total: 0,
                  page,
                  limit: this.limit,
                  pages: 0,
                };
                return of({ data: [] as Card[], meta: fallbackMeta });
              })
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(({ data, meta }) => {
        this.cards = data ?? [];
        this.meta = meta ?? {
          total: 0,
          page: this.page,
          limit: this.limit,
          pages: 0,
        };
        this.loading = false;
      });

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (this.loading) return;
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          this.goPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          this.goNext();
        }
      });
  }

  get totalRecords(): number { return this.meta?.total ?? 0; }
  get totalPages(): number {
    const t = this.totalRecords;
    return t > 0 ? Math.ceil(t / this.limit) : 0;
  }
  get currentPage(): number { return this.meta?.page ?? this.page; }
  get isFirstPage(): boolean { return this.currentPage <= 1; }
  get isLastPage(): boolean { return this.currentPage >= this.totalPages; }

  // --- 3. NUEVO MÉTODO PARA MANEJAR EL CAMBIO DE PÁGINA ---
  onPageChange(newPage: number): void {
    this.page$.next(newPage);
  }

  // Los métodos goPrev y goNext siguen funcionando para las flechas del teclado
  goPrev() {
    if (this.shuffle) this.shuffle$.next(false);
    if (!this.isFirstPage) this.page$.next(this.currentPage - 1);
  }

  goNext() {
    if (this.shuffle) this.shuffle$.next(false);
    if (!this.isLastPage) this.page$.next(this.currentPage + 1);
  }

  shuffleOne()
  {
    // Muestra UNA carta aleatoria sin cambiar el modo shuffle
    const randomPage = Math.floor( Math.random() * this.totalPages ) + 1;
    this.shuffle$.next(true);
    this.page$.next( randomPage );
  }

  toggleReverse() {
    this.reverse$.next(!this.reverse);
    this.page$.next(1);
  }

  openImageInModal(url?: string | null) {
    if (!url) return;
    this.modalImageUrl = url;
    this.showImage = true;
  }
  closeImageModal() {
    this.showImage = false;
    this.modalImageUrl = null;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
