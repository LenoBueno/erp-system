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

// Função auxiliar para formatar valores monetários
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const generateOrderHTML = (orderData: OrderData): string => {
  // Criar o HTML do pedido
  const issueDate = format(orderData.issue_date, 'dd/MM/yyyy', { locale: ptBR });
  const deliveryDate = orderData.delivery_date 
    ? format(orderData.delivery_date, 'dd/MM/yyyy', { locale: ptBR })
    : 'Não definida';

  // Gerar linhas da tabela de itens
  const itemRows = orderData.items.map(item => `
    <tr>
      <td>${item.product_code}</td>
      <td>${item.product_name}</td>
      <td>${item.quantity}</td>
      <td>${item.unit}</td>
      <td>${formatCurrency(item.unit_price)}</td>
      <td>${item.discount_percent}%</td>
      <td>${formatCurrency(item.subtotal)}</td>
      <td>${formatCurrency(item.total)}</td>
    </tr>
  `).join('');

  // Criar o HTML completo
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Pedido ${orderData.order_number}</title>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          color: #2563eb;
        }
        .header p {
          margin: 5px 0;
          font-size: 14px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section h2 {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
          font-size: 16px;
          color: #4b5563;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .info-box {
          padding: 10px;
          background-color: #f9fafb;
          border-radius: 5px;
        }
        .info-box p {
          margin: 5px 0;
          font-size: 14px;
        }
        .info-box .label {
          font-weight: bold;
          color: #6b7280;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #e5e7eb;
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background-color: #f3f4f6;
          font-weight: bold;
          color: #4b5563;
        }
        .summary {
          margin-left: auto;
          width: 300px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }
        .summary-row.total {
          font-weight: bold;
          font-size: 16px;
          border-top: 1px solid #e5e7eb;
          padding-top: 10px;
          margin-top: 5px;
        }
        .notes {
          padding: 15px;
          background-color: #f9fafb;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        @media print {
          body {
            padding: 0;
            margin: 0;
          }
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>PEDIDO DE VENDA</h1>
        <p>Nº ${orderData.order_number}</p>
      </div>
      
      <div class="info-grid">
        <div class="info-box">
          <p><span class="label">Data de Emissão:</span> ${issueDate}</p>
          <p><span class="label">Data de Entrega:</span> ${deliveryDate}</p>
        </div>
        <div class="info-box">
          <p><span class="label">Forma de Pagamento:</span> ${orderData.payment_method}</p>
          <p><span class="label">Condição de Pagamento:</span> ${orderData.payment_term}</p>
          ${orderData.seller ? `<p><span class="label">Vendedor:</span> ${orderData.seller.name}</p>` : ''}
        </div>
      </div>
      
      <div class="section">
        <h2>Dados do Cliente</h2>
        <div class="info-box">
          <p><span class="label">Nome:</span> ${orderData.customer.name}</p>
          <p><span class="label">Documento:</span> ${orderData.customer.document}</p>
          <p><span class="label">Email:</span> ${orderData.customer.email}</p>
          <p><span class="label">Telefone:</span> ${orderData.customer.phone}</p>
        </div>
      </div>
      
      <div class="section">
        <h2>Endereços</h2>
        <div class="info-grid">
          <div class="info-box">
            <p><span class="label">Endereço de Entrega:</span></p>
            <p>${orderData.shipping_address}</p>
          </div>
          <div class="info-box">
            <p><span class="label">Endereço de Cobrança:</span></p>
            <p>${orderData.billing_address}</p>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>Itens do Pedido</h2>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Unid.</th>
              <th>Preço Unit.</th>
              <th>Desc. (%)</th>
              <th>Subtotal</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>
      </div>
      
      <div class="summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${formatCurrency(orderData.subtotal)}</span>
        </div>
        <div class="summary-row">
          <span>Impostos (10%):</span>
          <span>${formatCurrency(orderData.tax_total)}</span>
        </div>
        <div class="summary-row">
          <span>Frete:</span>
          <span>${formatCurrency(orderData.shipping_cost)}</span>
        </div>
        <div class="summary-row">
          <span>Outras Taxas:</span>
          <span>${formatCurrency(orderData.other_costs)}</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>${formatCurrency(orderData.total_amount)}</span>
        </div>
      </div>
      
      ${orderData.notes ? `
      <div class="notes">
        <h2>Observações</h2>
        <p>${orderData.notes}</p>
      </div>
      ` : ''}
      
      <div class="footer">
        <p>Documento gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; margin-bottom: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background-color: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Imprimir Pedido
        </button>
      </div>
    </body>
    </html>
  `;
  
  return html;
};