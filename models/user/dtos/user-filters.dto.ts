export interface UserFiltersDTO {
  search?: string | null;
  includeIds?: string[] | null;
}

export type UserIdentifierDTO =
  | {
      id: string;
    }
  | {
      username: string;
    }
  | {
      email: string;
    };
