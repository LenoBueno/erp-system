export interface Cliente {
  id: string;
  codigo: string;
  nome: string;
  tipo: 'PF' | 'PJ';
  documento: string;
  grupo: string;
  status: 'ativo' | 'inativo';
  email: string;
  telefone: string;
  nomeContato: string;
  enderecoFaturamento: Endereco;
  enderecoEntrega: Endereco;
  condicoesComerciais: CondicoesComerciais;
  informacoesFinanceiras: InformacoesFinanceiras;
  observacoes: string;
  anexos: string[];
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface Endereco {
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
}

export interface CondicoesComerciais {
  moeda: 'BRL' | 'USD' | 'EUR';
  tabelaPreco: string;
  formaPagamento: string;
  condicaoPagamento: string;
}

export interface InformacoesFinanceiras {
  limiteCredito: number;
  totalCompras: number;
  totalGasto: number;
}
