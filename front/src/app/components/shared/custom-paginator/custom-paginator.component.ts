import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomPaginatorComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  // --- NUEVA PROPIEDAD DE ENTRADA ---
  @Input() label: string = 'Página'; // Asignamos 'Página' como valor por defecto

  @Output() pageChange = new EventEmitter<number>();

  goPrev(): void {
    if ( this.totalPages <= 1 ) return;

    if ( this.currentPage > 1 )
    {
      this.pageChange.emit(this.currentPage - 1);
    } else
    {
      // Si está en la 1, ir a la última
      this.pageChange.emit( this.totalPages );
    }
  }

  goNext(): void {
    if ( this.totalPages <= 1 ) return;

    if ( this.currentPage < this.totalPages )
    {
      this.pageChange.emit(this.currentPage + 1);
    } else
    {
      // Si está en la última, ir a la 1
      this.pageChange.emit( 1 );
    }
  }
}
