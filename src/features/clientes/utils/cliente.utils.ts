import { Cliente } from '../types/cliente.type';

export const validarCliente = (cliente: Partial<Cliente>): string[] => {
  const erros: string[] = [];

  if (!cliente.nome) {
    erros.push('Nome é obrigatório');
  }

  if (!cliente.documento) {
    erros.push('Documento é obrigatório');
  }

  if (!cliente.email) {
    erros.push('Email é obrigatório');
  }

  return erros;
};

export const formatarDocumento = (documento: string, tipo: 'PF' | 'PJ'): string => {
  if (tipo === 'PF') {
    // Formatar CPF
    return documento.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  // Formatar CNPJ
  return documento.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

export const validarEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
