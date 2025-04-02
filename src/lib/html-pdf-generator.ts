import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from './utils';
import { OrderData, OrderItem } from './types';

export const generateOrderHTML = (orderData: OrderData): string => {
  // Criar o HTML do pedido
  const issueDate = format(orderData.issue_date, 'dd/MM/yyyy', { locale: ptBR });
  const deliveryDate = orderData.delivery_date
    ? format(orderData.delivery_date, 'dd/MM/yyyy', { locale: ptBR })
    : 'Não definida';

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pedido ${orderData.order_number}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #ddd;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #ddd;
        }
        .company-name {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }
        .order-info {
          margin-bottom: 20px;
        }
        .order-number {
          font-size: 18px;
          font-weight: bold;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          margin-top: 15px;
          margin-bottom: 5px;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        .customer-info, .addresses {
          margin-bottom: 20px;
        }
        .info-row {
          margin-bottom: 5px;
        }
        .label {
          font-weight: bold;
          min-width: 120px;
          display: inline-block;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          text-align: left;
          padding: 8px;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f5f5f5;
        }
        .text-right {
          text-align: right;
        }
        .summary {
          margin-top: 20px;
          margin-left: auto;
          width: 250px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .total {
          font-weight: bold;
          font-size: 16px;
          margin-top: 10px;
          padding-top: 5px;
          border-top: 1px solid #ddd;
        }
        .notes {
          margin-top: 20px;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 4px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="company-name">LENO BUENO ERP</h1>
          <p>Sistema de Gestão Empresarial</p>
        </div>
        
        <div class="order-info">
          <p class="order-number">Pedido: ${orderData.order_number}</p>
          <div class="info-row">
            <span class="label">Data de Emissão:</span>
            <span>${issueDate}</span>
          </div>
          <div class="info-row">
            <span class="label">Data de Entrega:</span>
            <span>${deliveryDate}</span>
          </div>
        </div>
        
        <div class="customer-info">
          <h2 class="section-title">Dados do Cliente</h2>
          <div class="info-row">
            <span class="label">Nome:</span>
            <span>${orderData.customer.name}</span>
          </div>
          <div class="info-row">
            <span class="label">Documento:</span>
            <span>${orderData.customer.document}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span>${orderData.customer.email}</span>
          </div>
          <div class="info-row">
            <span class="label">Telefone:</span>
            <span>${orderData.customer.phone}</span>
          </div>
        </div>
        
        <div class="addresses">
          <h2 class="section-title">Endereços</h2>
          <div class="info-row">
            <span class="label">Endereço de Entrega:</span>
            <span>${orderData.shipping_address}</span>
          </div>
          <div class="info-row">
            <span class="label">Endereço de Cobrança:</span>
            <span>${orderData.billing_address}</span>
          </div>
        </div>
        
        <h2 class="section-title">Itens do Pedido</h2>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Produto</th>
              <th>Qtde</th>
              <th>Unid.</th>
              <th>Preço Unit.</th>
              <th>Desconto</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderData.items.map((item: OrderItem) => `
              <tr>
                <td>${item.product_code}</td>
                <td>${item.product_name}</td>
                <td>${item.quantity}</td>
                <td>${item.unit}</td>
                <td class="text-right">${formatCurrency(item.unit_price)}</td>
                <td class="text-right">${item.discount_percent}%</td>
                <td class="text-right">${formatCurrency(item.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${formatCurrency(orderData.subtotal)}</span>
          </div>
          <div class="summary-row">
            <span>Frete:</span>
            <span>${formatCurrency(orderData.shipping_cost)}</span>
          </div>
          <div class="summary-row">
            <span>Outros Custos:</span>
            <span>${formatCurrency(orderData.other_costs)}</span>
          </div>
          <div class="summary-row">
            <span>Impostos:</span>
            <span>${formatCurrency(orderData.tax_total)}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>${formatCurrency(orderData.total_amount)}</span>
          </div>
        </div>
        
        <div>
          <h2 class="section-title">Pagamento</h2>
          <div class="info-row">
            <span class="label">Forma de Pagamento:</span>
            <span>${orderData.payment_method}</span>
          </div>
          <div class="info-row">
            <span class="label">Condição de Pagamento:</span>
            <span>${orderData.payment_term}</span>
          </div>
        </div>
        
        ${orderData.notes ? `
          <div class="notes">
            <h2 class="section-title">Observações</h2>
            <p>${orderData.notes}</p>
          </div>
        ` : ''}
        
        <div class="footer">
          <p>Documento gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}</p>
          <p>LENO BUENO ERP - Sistema de Gestão Empresarial</p>
        </div>
      </div>
    </body>
    </html>
  `;
};