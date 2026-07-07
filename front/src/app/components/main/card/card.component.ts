import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Card } from '../../../api/models';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() card!: Card; // el servidor ya trae english/spanish (o invertidos si reverse=true)

  flipped = false;

  get frontText(): string {
    return this.card?.spanish ?? '';
  }
  get backText(): string {
    return this.card?.english ?? '';
  }

  getImg(): string {
    return this.card?.imageUrl ?? '';
  }

  hasImage(): boolean {
    const imgUrl = this.getImg();
    return !!imgUrl && imgUrl.trim().length > 0;
  }

  toggleFlip() {
    this.flipped = !this.flipped;
  }
}
