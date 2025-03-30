import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderItem {
  product_code: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_percent: number;
  subtotal: number;
  total: number;
}

interface OrderData {
  order_number: string;
  issue_date: Date;
  delivery_date?: Date;
  customer: {
    name: string;
    document: string;
    email: string;
    phone: string;
  };
  seller?: {
    name: string;
  };
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

export const generateOrderPDF = (orderData: OrderData): string => {
  // Criar nova instância do PDF
  const doc = new jsPDF();
  
  // Configurações de fonte
  doc.setFont('helvetica');
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.text('PEDIDO DE VENDA', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Nº ${orderData.order_number}`, 105, 30, { align: 'center' });
  
  // Informações do pedido
  doc.setFontSize(10);
  doc.text(`Data de Emissão: ${format(orderData.issue_date, 'dd/MM/yyyy', { locale: ptBR })}`, 15, 40);
  if (orderData.delivery_date) {
    doc.text(`Data de Entrega: ${format(orderData.delivery_date, 'dd/MM/yyyy', { locale: ptBR })}`, 15, 45);
  }
  
  // Informações do cliente
  doc.setFontSize(11);
  doc.text('Dados do Cliente', 15, 55);
  doc.setFontSize(10);
  doc.text(`Nome: ${orderData.customer.name}`, 15, 60);
  doc.text(`Documento: ${orderData.customer.document}`, 15, 65);
  doc.text(`Email: ${orderData.customer.email}`, 15, 70);
  doc.text(`Telefone: ${orderData.customer.phone}`, 15, 75);
  
  // Endereços
  doc.setFontSize(11);
  doc.text('Endereço de Entrega', 15, 85);
  doc.setFontSize(10);
  doc.text(orderData.shipping_address, 15, 90);
  
  doc.setFontSize(11);
  doc.text('Endereço de Cobrança', 15, 100);
  doc.setFontSize(10);
  doc.text(orderData.billing_address, 15, 105);
  
  // Informações de pagamento
  doc.setFontSize(11);
  doc.text('Informações de Pagamento', 15, 115);
  doc.setFontSize(10);
  doc.text(`Forma de Pagamento: ${orderData.payment_method}`, 15, 120);
  doc.text(`Condição de Pagamento: ${orderData.payment_term}`, 15, 125);
  
  // Vendedor
  if (orderData.seller) {
    doc.text(`Vendedor: ${orderData.seller.name}`, 15, 130);
  }
  
  // Tabela de itens
  doc.setFontSize(11);
  doc.text('Itens do Pedido', 15, 140);
  
  // @ts-ignore - jspdf-autotable não está tipado corretamente
  doc.autoTable({
    startY: 145,
    head: [['Código', 'Produto', 'Qtd', 'Unid.', 'Preço Unit.', 'Desc.', 'Subtotal', 'Total']],
    body: orderData.items.map(item => [
      item.product_code,
      item.product_name,
      item.quantity.toString(),
      item.unit,
      formatCurrency(item.unit_price),
      `${item.discount_percent}%`,
      formatCurrency(item.subtotal),
      formatCurrency(item.total)
    ]),
    theme: 'grid',
    headStyles: { fillColor: [66, 66, 66] },
    margin: { top: 145 },
  });
  
  // @ts-ignore - Obter a posição Y final da tabela
  const finalY = (doc as any).lastAutoTable.finalY || 200;
  
  // Resumo financeiro
  doc.setFontSize(10);
  doc.text(`Subtotal: ${formatCurrency(orderData.subtotal)}`, 150, finalY + 10, { align: 'right' });
  doc.text(`Impostos: ${formatCurrency(orderData.tax_total)}`, 150, finalY + 15, { align: 'right' });
  doc.text(`Frete: ${formatCurrency(orderData.shipping_cost)}`, 150, finalY + 20, { align: 'right' });
  doc.text(`Outras Taxas: ${formatCurrency(orderData.other_costs)}`, 150, finalY + 25, { align: 'right' });
  
  doc.setFontSize(12);
  doc.text(`Total: ${formatCurrency(orderData.total_amount)}`, 150, finalY + 35, { align: 'right' });
  
  // Observações
  if (orderData.notes) {
    doc.setFontSize(11);
    doc.text('Observações', 15, finalY + 45);
    doc.setFontSize(10);
    doc.text(orderData.notes, 15, finalY + 50);
  }
  
  // Rodapé
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      `Página ${i} de ${pageCount} - Emitido em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`,
      105,
      285,
      { align: 'center' }
    );
  }
  
  // Retornar o PDF como URL de dados
  return doc.output('datauristring');
};

// Função auxiliar para formatar valores monetários
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};