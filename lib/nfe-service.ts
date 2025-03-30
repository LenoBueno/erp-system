/**
 * Serviço para integração com APIs de Nota Fiscal Eletrônica
 * 
 * Este serviço fornece funções para geração de NF-e e envio de e-mails
 * relacionados a notas fiscais para clientes.
 */

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderItem {
  product_id: number;
  product_code: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  unit: string;
  discount_percent: number;
  tax_rate: number;
  subtotal: number;
  total: number;
}

interface Customer {
  id: number;
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  customer: Customer;
  seller_id?: number;
  seller_name?: string;
  status: string;
  issue_date: string;
  delivery_date?: string;
  payment_method: string;
  payment_term: string;
  shipping_address: string;
  billing_address: string;
  shipping_cost: number;
  other_costs: number;
  subtotal: number;
  tax_total: number;
  total_amount: number;
  notes: string;
  items: OrderItem[];
}

interface NFEResponse {
  success: boolean;
  message: string;
  nfe_number?: string;
  access_key?: string;
  pdf_url?: string;
  xml_url?: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
}

/**
 * Gera uma Nota Fiscal Eletrônica para um pedido
 * 
 * Esta função se comunica com uma API externa de emissão de NF-e
 * e retorna os dados da nota fiscal gerada.
 * 
 * @param order - Dados do pedido para geração da NF-e
 * @returns Resposta da API de NF-e com os dados da nota fiscal gerada
 */
export async function generateNFE(order: Order): Promise<NFEResponse> {
  try {
    // Em um ambiente real, aqui seria feita uma chamada para a API de emissão de NF-e
    // como SEFAZ, FocusNFe, Nuvem Fiscal, etc.
    
    // Simulação da resposta da API
    const issueDate = new Date();
    const nfeNumber = `${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    const accessKey = `35${format(issueDate, 'yyMM')}${
      order.customer.document.replace(/\D/g, '').substring(0, 14).padEnd(14, '0')
    }${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}${
      Math.floor(Math.random() * 10).toString()
    }`;
    
    // Simula o tempo de processamento da API externa
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      message: 'Nota fiscal gerada com sucesso',
      nfe_number: nfeNumber,
      access_key: accessKey,
      pdf_url: `/api/nfe/${nfeNumber}/pdf`,
      xml_url: `/api/nfe/${nfeNumber}/xml`,
    };
  } catch (error) {
    console.error('Erro ao gerar NF-e:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao gerar NF-e',
    };
  }
}

/**
 * Envia um e-mail com a nota fiscal para o cliente
 * 
 * @param order - Dados do pedido
 * @param nfeData - Dados da NF-e gerada
 * @returns Resposta do serviço de e-mail
 */
export async function sendNFEEmail(order: Order, nfeData: NFEResponse): Promise<EmailResponse> {
  try {
    if (!order.customer.email) {
      throw new Error('E-mail do cliente não informado');
    }
    
    if (!nfeData.nfe_number || !nfeData.access_key) {
      throw new Error('Dados da NF-e incompletos');
    }
    
    // Em um ambiente real, aqui seria feita uma chamada para um serviço de e-mail
    // como SendGrid, Mailchimp, AWS SES, etc.
    
    // Simulação do envio de e-mail
    const emailContent = {
      to: order.customer.email,
      subject: `Nota Fiscal Eletrônica - Pedido ${order.order_number}`,
      body: `
        <h1>Nota Fiscal Eletrônica</h1>
        <p>Prezado(a) ${order.customer.name},</p>
        <p>Sua nota fiscal eletrônica foi emitida com sucesso.</p>
        <p><strong>Número da NF-e:</strong> ${nfeData.nfe_number}</p>
        <p><strong>Chave de Acesso:</strong> ${nfeData.access_key}</p>
        <p><strong>Data de Emissão:</strong> ${format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}</p>
        <p><strong>Valor Total:</strong> ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total_amount)}</p>
        <p>Em anexo você encontrará o arquivo PDF da DANFE e o arquivo XML da NF-e.</p>
        <p>Agradecemos pela preferência!</p>
      `,
      attachments: [
        { url: nfeData.pdf_url, filename: `nfe_${nfeData.nfe_number}.pdf` },
        { url: nfeData.xml_url, filename: `nfe_${nfeData.nfe_number}.xml` }
      ]
    };
    
    // Simula o tempo de processamento do serviço de e-mail
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('E-mail enviado:', emailContent);
    
    return {
      success: true,
      message: 'E-mail enviado com sucesso',
    };
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido ao enviar e-mail',
    };
  }
}