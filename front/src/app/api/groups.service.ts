import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Group } from './models';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/groups`;

  list(opts?: { enabled?: boolean; q?: string }): Observable<Group[]> {
    let params = new HttpParams();
    if (opts?.enabled !== undefined) params = params.set('enabled', String(opts.enabled));
    if (opts?.q) params = params.set('q', opts.q);
    return this.http
      .get<ApiResponse<Group[]>>(this.base, { params })
      .pipe(map((r) => r?.data ?? []));
  }

  getById( id: string ): Observable<Group>
  {
    return this.http
      .get<ApiResponse<Group>>( `${ this.base }/${ id }` )
      .pipe( map( ( r ) => r.data ) );
  }

  create(payload: Pick<Group, 'name' | 'slug'> & Partial<Group>): Observable<Group> {
    return this.http
      .post<ApiResponse<Group>>(this.base, payload)
      .pipe(map((r) => r.data));
  }

  // --- MÉTODO REEMPLAZADO ---
  /**
   * PATCH /api/groups/:id
   * Actualiza parcialmente un grupo.
   */
  update(id: string, payload: Partial<Group>): Observable<Group> {
    return this.http
      .patch<ApiResponse<Group>>(`${this.base}/${id}`, payload)
      .pipe(map((r) => r.data));
  }

  hide(id: string): Observable<Group> {
    return this.http
      .post<ApiResponse<Group>>(`${this.base}/${id}/hide`, {})
      .pipe(map((r) => r.data));
  }

  show(id: string): Observable<Group> {
    return this.http
      .post<ApiResponse<Group>>(`${this.base}/${id}/show`, {})
      .pipe(map((r) => r.data));
  }
}
