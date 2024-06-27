import { initializePaddle, Paddle, } from '@paddle/paddle-js';
import { APP_DOMAIN } from '../constants';


let paddlePromise: Promise<Paddle | undefined>;

export async function getPaddle(slug: string, PADDLE_SECRET_CLIENT_KEY?: string) {
  if (!PADDLE_SECRET_CLIENT_KEY) {
    throw new Error("Paddle secret key is missing")
  }
  if (!paddlePromise) {
    paddlePromise = initializePaddle({
      environment: process.env.PADDLE_ENV === 'production' ? 'production' : 'sandbox',
      token: PADDLE_SECRET_CLIENT_KEY ?? "",
      checkout: {
        settings: {
          successUrl: `${APP_DOMAIN}/${slug}/settings/billing?success=true`,
          displayMode: 'overlay',
          showAddTaxId: true,
          theme: 'light',
        },
      },
      debug: true,
      eventCallback(event) {
        console.log(event);
      },

    })
  }

  return paddlePromise;
};
