import { NextRequest, NextResponse } from 'next/server';
import { generateNFE, sendNFEEmail } from '@/lib/nfe-service';

/**
 * API para geração de Nota Fiscal Eletrônica e envio por e-mail
 * 
 * POST /api/orders/[id]/nfe - Gera uma NF-e para o pedido
 * POST /api/orders/[id]/nfe/email - Envia a NF-e por e-mail
 */

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Buscar dados do pedido
    const orderId = params.id;
    const orderResponse = await fetch(`${request.nextUrl.origin}/api/orders/${orderId}`);
    
    if (!orderResponse.ok) {
      throw new Error('Falha ao buscar dados do pedido');
    }
    
    const order = await orderResponse.json();
    
    // Verificar se o pedido está em um status válido para emissão de NF-e
    if (order.status !== 'aprovado' && order.status !== 'faturado') {
      return NextResponse.json(
        { error: 'Pedido não está em status válido para emissão de NF-e' },
        { status: 400 }
      );
    }
    
    // Gerar NF-e
    const nfeResponse = await generateNFE(order);
    
    if (!nfeResponse.success) {
      return NextResponse.json(
        { error: nfeResponse.message },
        { status: 500 }
      );
    }
    
    // Verificar se deve enviar e-mail automaticamente
    const requestData = await request.json().catch(() => ({}));
    const sendEmail = requestData?.sendEmail;
    
    if (sendEmail) {
      const emailResponse = await sendNFEEmail(order, nfeResponse);
      
      return NextResponse.json({
        ...nfeResponse,
        emailSent: emailResponse.success,
        emailMessage: emailResponse.message
      });
    }
    
    return NextResponse.json(nfeResponse);
  } catch (error) {
    console.error('Erro ao processar NF-e:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido ao processar NF-e' },
      { status: 500 }
    );
  }
}