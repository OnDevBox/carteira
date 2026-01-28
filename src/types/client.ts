export interface Client {
  id: string;
  name: string;
  birthDate?: Date;
  registrationDate?: Date;
  contact?: string;
  contactBirthday?: Date;
  contactPhone?: string;
  contactEmail?: string;
  cnpjCpf?: string;
  activity?: string;
  lastPurchaseDate: Date;
  phone?: string;
  cellphone?: string;
  email?: string;
  budgetStatus?: string;
  orderCount?: number;
  total?: number;
  averageTicket?: number;
  comment?: string;
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
