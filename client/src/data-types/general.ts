export interface Suggestion {
  id: number;
  label: string;
}

export interface ApiResponse<T> {
  count: number;
  total: number;
  fromItem: number;
  pageSize: number
  result: T[];
}