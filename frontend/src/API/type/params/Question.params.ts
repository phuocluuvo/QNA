export type GetQuesionParams = {
  page: number;
  limit: number;
  "filter.type"?: string;
  sortBy?: string;
  search?: string;
  searchBy?: string;
};
