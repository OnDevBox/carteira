export interface Client {
  id: string;
  name: string;
  lastPurchaseDate: Date;
  month: number;
  year: number;
}

export interface MonthColumn {
  month: number;
  year: number;
  label: string;
  clients: Client[];
  color: string;
}
