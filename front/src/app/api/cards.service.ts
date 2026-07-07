import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, Card, PaginationMeta } from './models';
import { environment } from '../../environments/environment';

export interface ListCardsOptions {
  groupId?: string;
  enabled?: boolean;
  page?: number;
  limit?: number;
  q?: string;
  reverse?: boolean;
  shuffle?: boolean; // orden aleatorio paginado
}

@Injectable({ providedIn: 'root' })
export class CardsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/cards`;

  /** GET /api/cards ... paginado */
  list(opts: ListCardsOptions = {}): Observable<{ data: Card[]; meta: PaginationMeta }> {
    let params = new HttpParams();
    if (opts.groupId) params = params.set('groupId', opts.groupId);
    if (opts.enabled !== undefined) params = params.set('enabled', String(opts.enabled));
    if (opts.page) params = params.set('page', String(opts.page));
    if (opts.limit) params = params.set('limit', String(opts.limit));
    if (opts.q) params = params.set('q', opts.q);
    if (opts.reverse !== undefined) params = params.set('reverse', String(opts.reverse));
    if (opts.shuffle !== undefined) params = params.set('shuffle', String(opts.shuffle));

    return this.http.get<ApiResponse<Card[]>>(`${this.base}`, { params }).pipe(
      map(r => ({ data: r.data, meta: r.meta as PaginationMeta }))
    );
  }

  /** GET /api/cards/random ... sin paginado */
  random(opts: { groupId?: string; enabled?: boolean; count?: number; reverse?: boolean } = {}): Observable<Card[]> {
    let params = new HttpParams();
    if (opts.groupId) params = params.set('groupId', opts.groupId);
    if (opts.enabled !== undefined) params = params.set('enabled', String(opts.enabled));
    if (opts.count) params = params.set('count', String(opts.count));
    if (opts.reverse !== undefined) params = params.set('reverse', String(opts.reverse));

    return this.http.get<ApiResponse<Card[]>>(`${this.base}/random`, { params }).pipe(map(r => r.data));
  }

  /** GET /api/cards/group/:groupId ... alternativa por ruta */
  listByGroup(groupId: string, opts: Omit<ListCardsOptions, 'groupId'> = {}): Observable<{ data: Card[]; meta: PaginationMeta }> {
    let params = new HttpParams();
    if (opts.enabled !== undefined) params = params.set('enabled', String(opts.enabled));
    if (opts.page) params = params.set('page', String(opts.page));
    if (opts.limit) params = params.set('limit', String(opts.limit));
    if (opts.q) params = params.set('q', opts.q);
    if (opts.reverse !== undefined) params = params.set('reverse', String(opts.reverse));
    if (opts.shuffle !== undefined) params = params.set('shuffle', String(opts.shuffle));

    return this.http.get<ApiResponse<Card[]>>(`${this.base}/group/${groupId}`, { params }).pipe(
      map(r => ({ data: r.data, meta: r.meta as PaginationMeta }))
    );
  }

  /** POST /api/cards */
  create(payload: Omit<Card, '_id' | 'createdAt' | 'updatedAt'>): Observable<Card> {
    return this.http.post<ApiResponse<Card>>(this.base, payload).pipe(map(r => r.data));
  }

  /** PATCH /api/cards/:id */
  update(id: string, patch: Partial<Omit<Card, '_id'>>): Observable<Card> {
    return this.http.patch<ApiResponse<Card>>(`${this.base}/${id}`, patch).pipe(map(r => r.data));
  }

  /** POST /api/cards/:id/hide */
  hide(id: string): Observable<Card> {
    return this.http.post<ApiResponse<Card>>(`${this.base}/${id}/hide`, {}).pipe(map(r => r.data));
  }

  /** POST /api/cards/:id/show */
  show(id: string): Observable<Card> {
    return this.http.post<ApiResponse<Card>>(`${this.base}/${id}/show`, {}).pipe(map(r => r.data));
  }
}
