export const ArticleStatus = {
  VALIDO: 'Válido',
  INVALIDO: 'Inválido', 
  PENDIENTE: 'Pendiente'
} as const;

export type ArticleStatus = typeof ArticleStatus[keyof typeof ArticleStatus];

export interface Article {
  id: string;
  date: Date;
  name: string;
  originalAmount: number;
  country: string;
  agentType: string;
  status: ArticleStatus;
  amountUSD?: number; // Nuevo campo del backend
}

export interface TableFilters {
  search: string;
  status: ArticleStatus | '';
  sortBy: 'date' | 'originalAmount' | '';
  sortOrder: 'asc' | 'desc';
}

export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'warning' | 'error';
}

export interface EditableField {
  id: string;
  field: 'name' | 'originalAmount';
  value: string | number;
}
