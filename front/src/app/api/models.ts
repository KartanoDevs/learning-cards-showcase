export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  meta?: any;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  shuffled?: boolean;
}

export interface Group {
    _id: string;
    name: string;
    description: string;
    slug: string;
    enabled: boolean;
  fav: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Card {
  _id: string;
  english: string;
  spanish: string;
  imageUrl?: string | null;
  groupId: string;
  order?: number;
  enabled: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}
