import { Cliente } from '../../../features/clientes/types/cliente.type';

export const mockClientes: Cliente[] = [
  {
    id: '1',
    codigo: 'CLI001',
    nome: 'Cliente Teste',
    tipo: 'PF',
    documento: '123.456.789-00',
    grupo: 'Varejo',
    status: 'ativo',
    email: 'teste@email.com',
    telefone: '(11) 99999-9999',
    nomeContato: 'Contato Teste',
    enderecoFaturamento: {
      rua: 'Rua Teste',
      numero: '123',
      complemento: 'Apt 10',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      pais: 'Brasil'
    },
    enderecoEntrega: {
      rua: 'Rua Teste',
      numero: '123',
      complemento: 'Apt 10',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      pais: 'Brasil'
    },
    condicoesComerciais: {
      moeda: 'BRL',
      tabelaPreco: 'Tabela 1',
      formaPagamento: 'Boleto',
      condicaoPagamento: 'À vista'
    },
    informacoesFinanceiras: {
      limiteCredito: 10000,
      totalCompras: 5000,
      totalGasto: 3000
    },
    observacoes: 'Cliente teste',
    anexos: [],
    criadoEm: new Date(),
    atualizadoEm: new Date()
  }
];

export const mockClienteService = {
  buscarTodos: jest.fn().mockResolvedValue(mockClientes),
  buscarPorId: jest.fn().mockImplementation((id: string) => {
    return Promise.resolve(mockClientes.find(cliente => cliente.id === id));
  }),
  criar: jest.fn().mockImplementation((cliente: Partial<Cliente>) => {
    const novoCliente = {
      id: (mockClientes.length + 1).toString(),
      ...cliente,
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };
    mockClientes.push(novoCliente);
    return Promise.resolve(novoCliente);
  }),
  atualizar: jest.fn().mockImplementation((id: string, cliente: Partial<Cliente>) => {
    const index = mockClientes.findIndex(c => c.id === id);
    if (index !== -1) {
      mockClientes[index] = {
        ...mockClientes[index],
        ...cliente,
        atualizadoEm: new Date()
      };
    }
    return Promise.resolve(mockClientes[index]);
  }),
  deletar: jest.fn().mockImplementation((id: string) => {
    const index = mockClientes.findIndex(c => c.id === id);
    if (index !== -1) {
      mockClientes.splice(index, 1);
    }
    return Promise.resolve();
  })
};
