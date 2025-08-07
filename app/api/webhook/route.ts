import { NextResponse } from 'next/server';

let MercadoPagoConfig: any;
let Preference: any;

async function initMercadoPago() {
  if (!Preference || !MercadoPagoConfig) {
    const mp = await import('mercadopago');
    MercadoPagoConfig = mp.MercadoPagoConfig;
    Preference = mp.Preference;
  }
}

export async function POST(req: Request) {
  try {
    if (!process.env.MP_ACCESS_TOKEN) {
      throw new Error('Access Token Mercado Pago não configurado');
    }

    const { valor, userId } = await req.json();

    await initMercadoPago();
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const preference = new Preference(client);

    const preferenceResponse = await preference.create({
      items: [
        {
          title: 'Adicionar saldo no jogo',
          quantity: 1,
          unit_price: Number(valor),
          currency_id: 'BRL',
        },
      ],
      payer: {
        email: 'email@comprador.com',
      },
      external_reference: userId,
      payment_methods: {
        excluded_payment_types: [{ id: 'ticket' }],
        installments: 1,
      },
      notification_url: 'https://SEU-DOMINIO.com/api/webhook',
    });

    return NextResponse.json(preferenceResponse);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 });
  }
}
