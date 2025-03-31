import { ClienteService } from '../cliente.service';
import { Cliente } from '../../types/cliente.type';

describe('ClienteService', () => {
  let service: ClienteService;

  beforeEach(() => {
    service = ClienteService.getInstance();
  });

  describe('buscarTodos', () => {
    it('deve retornar uma lista de clientes', async () => {
      // Mock da API
      jest.spyOn(service, 'buscarTodos').mockResolvedValue([
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
      ] as Cliente[]);

      const clientes = await service.buscarTodos();
      expect(clientes).toHaveLength(1);
      expect(clientes[0].nome).toBe('Cliente Teste');
    });
  });

  describe('criar', () => {
    it('deve criar um novo cliente', async () => {
      const novoCliente = {
        codigo: 'CLI002',
        nome: 'Novo Cliente',
        tipo: 'PF',
        documento: '987.654.321-00',
        email: 'novo@email.com',
        telefone: '(11) 88888-8888'
      };

      jest.spyOn(service, 'criar').mockResolvedValue({
        id: '2',
        ...novoCliente
      } as Cliente);

      const clienteCriado = await service.criar(novoCliente);
      expect(clienteCriado.id).toBe('2');
      expect(clienteCriado.nome).toBe('Novo Cliente');
    });
  });
});
