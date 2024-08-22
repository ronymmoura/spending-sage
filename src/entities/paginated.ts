export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};
