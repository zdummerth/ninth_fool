import { stripe } from 'utils/stripe';
import { withApiAuth } from '@supabase/auth-helpers-nextjs';
import { createOrRetrieveCustomer } from 'utils/supabase-admin';
import { getSignInRedirectUrl } from 'utils/helpers';

export default withApiAuth(async function createCheckoutSession(
  req,
  res,
  supabaseServerClient
) {
  if (req.method === 'POST') {
    const { price, quantity = 1, metadata = {} } = req.body;

    try {
      // console.log('tessting api route: ', req.body);
      const {
        data: { user }
      } = await supabaseServerClient.auth.getUser();
      console.log('got user: ', user?.id);

      const customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      });

      const session = await stripe.checkout.sessions.create({
        // payment_method_types: ['card'],
        billing_address_collection: 'required',
        customer,
        line_items: [
          {
            price: price.id,
            quantity
          }
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        subscription_data: {
          trial_from_plan: true,
          metadata
        },
        success_url: `${getSignInRedirectUrl()}/feed`,
        cancel_url: `${getSignInRedirectUrl()}/`
      });
      console.log('got session: ');

      return res.status(200).json({ sessionId: session.id });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
});
