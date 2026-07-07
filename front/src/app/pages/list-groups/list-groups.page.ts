import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

// Importación del servicio y modelos
import { GroupsService } from '../../api/groups.service';
import { Group } from '../../api/models';

// Módulos PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

// --- 1. IMPORTAR EL NUEVO COMPONENTE REUTILIZABLE ---
import { CustomPaginatorComponent } from '../../components/shared/custom-paginator/custom-paginator.component';

@Component({
  selector: 'app-list-groups-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    HttpClientModule,
    CustomPaginatorComponent // <-- 2. AÑADIR A LOS IMPORTS
  ],
  templateUrl: './list-groups.page.html',
  styleUrls: ['./list-groups.page.css'],
})
export class ListGroupsPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private groupsService = inject(GroupsService);

  public allGroups: Group[] = [];
  public filteredGroups: Group[] = [];
  public paginatedGroups: Group[] = [];
  public searchTerm: string = '';
  public hoveredGroupId: string | null = null;
  private dataSubscription?: Subscription;

  public rows: number = 56;
  public currentPage: number = 1;

  ngOnInit(): void {
    this.loadGroups();
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  loadGroups(): void {
    this.dataSubscription = this.groupsService.list({ enabled: true }).subscribe({
      next: (data: Group[]) => {
        this.allGroups = data;
        this.filterGroups();
      },
      error: (err: any) => {
        console.error('Error al cargar grupos:', err);
      }
    });
  }

  filterGroups(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredGroups = this.allGroups;
    } else {
      this.filteredGroups = this.allGroups.filter(group =>
        group.name.toLowerCase().includes(term) ||
        (group.description && group.description.toLowerCase().includes(term))
      );
    }
    // Ordenar: Favs > Visibles > Última modificación
    this.filteredGroups.sort( ( a, b ) =>
    {
      // 1. Favoritos primero
      if ( a.fav !== b.fav )
      {
        return a.fav ? -1 : 1;
      }
      // 2. Visibles (enabled) después
      if ( a.enabled !== b.enabled )
      {
        return a.enabled ? -1 : 1;
      }
      // 3. Fecha de modificación (más reciente primero)
      const dateA = a.updatedAt ? new Date( a.updatedAt ).getTime() : 0;
      const dateB = b.updatedAt ? new Date( b.updatedAt ).getTime() : 0;
      return dateB - dateA;
    } );

    this.currentPage = 1;
    this.updatePaginatedView();
  }

  // --- 3. NUEVO MÉTODO PARA MANEJAR EL CAMBIO DE PÁGINA DESDE EL COMPONENTE HIJO ---
  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updatePaginatedView();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredGroups.length / this.rows);
  }

  private updatePaginatedView(): void {
    const startIndex = (this.currentPage - 1) * this.rows;
    const endIndex = startIndex + this.rows;
    this.paginatedGroups = this.filteredGroups.slice(startIndex, endIndex);
  }

  selectGroup(groupId: string): void {
    this.router.navigate(['/list-cards', groupId]);
  }

  onMouseEnter(groupId: string): void {
    this.hoveredGroupId = groupId;
  }

  onMouseLeave(): void {
    this.hoveredGroupId = null;
  }
}

