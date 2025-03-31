import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../types/cliente.type';
import { Table } from '../ui/table';
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ClientList() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const navigate = useNavigate();

  const { data: clientsData, isLoading } = useQuery<Cliente[]>('clients', () =>
    ClienteService.getAll()
  );

  useEffect(() => {
    if (clientsData) {
      setClients(clientsData);
    }
  }, [clientsData]);

  const columns = [
    {
      header: 'Código',
      accessorKey: 'id',
    },
    {
      header: 'Nome',
      accessorKey: 'nome',
    },
    {
      header: 'Tipo',
      accessorKey: 'tipo',
    },
    {
      header: 'Grupo',
      accessorKey: 'grupo',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <Button
          variant="primary"
          onClick={() => navigate('/clientes/novo')}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <Table
        data={clients}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  );
}
