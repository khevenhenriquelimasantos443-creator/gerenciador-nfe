// Tipos compartilhados entre Backend e UI

export enum OrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  INVOICED = 'invoiced',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
  ACCOUNTANT = 'accountant',
  VIEWER = 'viewer',
}

export interface Customer {
  id: string;
  name: string;
  cnpj_cpf: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  tax_rate: number; // Percentual (ex: 18 para 18%)
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  customer_id: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  tax_total: number;
  notes?: string;
  version: number; // Para optimistic locking
  created_at: Date;
  updated_at: Date;
}

export interface Invoice {
  id: string;
  order_id: string;
  nfe_number: string;
  nfe_series: string;
  xml_content: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  sefaz_status?: string;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password_hash: string;
  last_login?: Date;
  created_at: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
}
