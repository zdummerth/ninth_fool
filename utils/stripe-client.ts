import { loadStripe, Stripe } from '@stripe/stripe-js';
import { isProduction } from './helpers';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ?? ''
    );
  }

  return stripePromise;
};
