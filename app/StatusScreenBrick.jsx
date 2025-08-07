'use client';

import { useEffect } from 'react';

export default function StatusScreenBrick({ paymentId, paymentPayload, onPaymentApproved }) {
  useEffect(() => {
    if (!paymentId) return;

    let isMounted = true; // flag para evitar updates após desmontar

    async function loadBrick() {
      if (!window.MercadoPago) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://sdk.mercadopago.com/js/v2';
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

      if (!isMounted) return;

      const mp = new window.MercadoPago('APP_USR-d2e34c8b-5564-4ddb-a18f-8d86226fb541', { locale: 'pt-BR' });
      const bricksBuilder = mp.bricks();

      const settings = {
        initialization: {
          paymentId,
          payload: paymentPayload,
        },
        callbacks: {
          onReady: () => {
            console.log('Status Screen Brick pronto');
          },
          onError: (error) => {
            console.error(error);
          },
          onPaymentApproved: () => {
            console.log('Pagamento aprovado!');
            onPaymentApproved();
          },
        },
      };

      const container = document.getElementById('statusScreenBrick_container');
      if (container) container.innerHTML = '';

      await bricksBuilder.create('statusScreen', 'statusScreenBrick_container', settings);
    }

    loadBrick();

    return () => {
      isMounted = false;
      // Opcional: limpar container ao desmontar
      const container = document.getElementById('statusScreenBrick_container');
      if (container) container.innerHTML = '';
    };
  }, [paymentId, paymentPayload, onPaymentApproved]);

  return (
    <div
      id="statusScreenBrick_container"
      style={{ width: 360, height: 500, marginTop: 20 }}
    />
  );
}
