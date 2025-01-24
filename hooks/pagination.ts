export interface PaginationMeta {
  page: number;
  items: number;

  totalItems: number;
  totalPages: number;
}

export interface PaginationOptions {
  page: number;
  items: number;
}

export const DefaultPagination: PaginationOptions = {
  page: 1,
  items: 10,
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
