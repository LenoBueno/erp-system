import { NextRequest, NextResponse } from 'next/server';
import { sendNFEEmail } from '@/lib/nfe-service';

/**
 * API para envio de e-mail com a Nota Fiscal Eletrônica
 * 
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
    
    // Buscar dados da NF-e já gerada
    const { nfeData } = await request.json();
    
    if (!nfeData || !nfeData.nfe_number) {
      return NextResponse.json(
        { error: 'Dados da NF-e não fornecidos' },
        { status: 400 }
      );
    }
    
    // Enviar e-mail
    const emailResponse = await sendNFEEmail(order, nfeData);
    
    return NextResponse.json(emailResponse);
  } catch (error) {
    console.error('Erro ao enviar e-mail da NF-e:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro desconhecido ao enviar e-mail' },
      { status: 500 }
    );
  }
}