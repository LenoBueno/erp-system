// Tipos para o banco de dados e resultados de consultas

// Interface para usuário retornado do banco de dados
export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  [key: string]: any; // Para campos adicionais que possam existir
}

// Interface para resultados de consultas SQL
export interface QueryResult<T = any> {
  rows: T[];  // Agora será um array de resultados, mais explícito
  rowCount: number; // Propriedade para indicar o número de linhas retornadas
}

// Interface para conexão de banco de dados
export interface DbConnection {
  execute: (sql: string, params?: any[]) => Promise<[any[], any]>;  // Resultado da consulta: [rows, fields]
  beginTransaction: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  release: () => void;
}

// Interface para o pool de conexões
export interface DbPool {
  execute: (sql: string, params?: any[]) => Promise<[any[], any]>;  // Resultado da consulta: [rows, fields]
  getConnection: () => Promise<DbConnection>;
}

// ===== Interfaces para Pedidos e NFe =====

/**
 * Interface para itens de pedido e nota fiscal
 */
export interface OrderItem {
  product_code: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_percent: number;
  subtotal: number;
  total: number;
}

/**
 * Interface base para dados de cliente
 */
export interface CustomerData {
  name: string;
  document: string;
  email: string;
  phone: string;
}

/**
 * Interface para dados de vendedor
 */
export interface SellerData {
  name: string;
  id?: string;
}

/**
 * Interface para dados de pedido
 */
export interface OrderData {
  order_number: string;
  issue_date: Date;
  delivery_date?: Date;
  customer: CustomerData;
  seller?: SellerData;
  shipping_address: string;
  billing_address: string;
  payment_method: string;
  payment_term: string;
  items: OrderItem[];
  shipping_cost: number;
  other_costs: number;
  subtotal: number;
  tax_total: number;
  total_amount: number;
  notes: string;
}

/**
 * Interface para dados de nota fiscal, estendendo a interface de pedido
 */
export interface NFeData extends Omit<OrderData, 'order_number'> {
  nfe_number: string;
  nfe_series: string;
  issue_datetime: Date;
  operation_nature: string;
  payment_indicator: string;
  tax_document?: {
    icms: number;
    pis: number;
    cofins: number;
    ipi?: number;
  };
  additional_information?: string;
}

/**
 * Interface para componente de tabela de dados genérica
 */
export interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    header: string;
    formatter?: (value: any, row: T) => React.ReactNode;
    sortable?: boolean;
  }[];
  actions?: {
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T) => void;
    disabled?: (item: T) => boolean;
  }[];
  pagination?: {
    pageSize: number;
    currentPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  };
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

/**
 * Interface para propriedades de componente de gráfico genérico
 */
export interface ChartProps {
  type: 'bar' | 'line' | 'pie' | 'donut';
  data: {
    labels: string[];
    datasets: {
      label?: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
      fill?: boolean;
      tension?: number;
    }[];
  };
  options?: {
    height?: number;
    width?: number;
    valuePrefix?: string;
    valueSuffix?: string;
    showLegend?: boolean;
    showGrid?: boolean;
  };
}

/**
 * Interface para dados de fluxo de caixa
 */
export interface CashFlowData {
  date: Date;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'canceled';
}

/**
 * Interface para componente de formulário multi-etapas
 */
export interface MultiStepFormProps {
  steps: {
    title: string;
    component: React.ComponentType<any>;
    validationSchema?: any;
  }[];
  initialValues: any;
  onSubmit: (values: any) => void | Promise<void>;
  onCancel?: () => void;
  submitButtonLabel?: string;
  cancelButtonLabel?: string;
}
