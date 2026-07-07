import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

// Los componentes hijos que se mostrarán
import { AdminGroupsComponent } from './admin-groups/admin-groups.component';
import { AdminCardsComponent } from './admin-cards.component';

// Importa los nuevos componentes que crearemos
// import { AdminCardsComponent } from '../admin-cards/admin-cards.component';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AdminGroupsComponent,
    AdminCardsComponent
  ],
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})
export class AdminViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private querySub?: Subscription;

  // Vista seleccionada por defecto, que determinará qué componente se muestra
  selectedView: 'groups' | 'cards' = 'groups';

    // Propiedad para controlar qué elemento tiene el hover
  public hoveredView: 'groups' | 'cards' | null = null;

  ngOnInit(): void {
    this.querySub = this.route.queryParamMap.subscribe(params => {
      const view = params.get('view');
      this.selectedView = view === 'cards' ? 'cards' : 'groups';
    });
  }
}
