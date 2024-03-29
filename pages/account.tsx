import Link from 'next/link';
import { useState, ReactNode } from 'react';

import LoadingDots from 'components/ui/LoadingDots';
import Button from 'components/ui/Button';
import InternalLink from '@/components/ui/InternalLink';
import { useUser } from 'utils/useUser';
import { postData } from 'utils/helpers';

import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';

import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="border border-zinc-700 bg-black	max-w-3xl w-full p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="border-t border-zinc-700 p-4 text-zinc-500 rounded-b-md">
        {footer}
      </div>
    </div>
  );
}

export const getServerSideProps = withPageAuth({ redirectTo: '/signin' });

export default function Account() {
  const [loading, setLoading] = useState(false);
  const { isLoading, subscription, user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link'
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  return (
    <section className="pb-20 max-w-3xl mx-auto px-4">
      <div className=" pt-8 sm:pt-24 pb-8 px-4 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
          <p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
            We partnered with Stripe for a simplified billing.
          </p>
        </div>
      </div>
      <div className="">
        <Card
          title="Your Plan"
          description={
            subscription
              ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
              : ''
          }
        >
          <div className="text-xl mt-8 mb-4 font-semibold">
            {isLoading ? (
              <div className="h-12 mb-6">
                <LoadingDots />
              </div>
            ) : subscription ? (
              <div>
                <div>
                  {`${subscriptionPrice}/${subscription?.prices?.interval}`}
                </div>
                <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
                  <p className="pb-4 sm:pb-0">
                    Manage your subscription on Stripe.
                  </p>
                  <button
                    className="pt-2 pb-3 px-4 rounded-full text-center shadow shadow-black bg-white hover:bg-gray-600 hover:text-white text-black font-semibold"
                    disabled={loading}
                    onClick={redirectToCustomerPortal}
                  >
                    Open customer portal
                  </button>
                </div>
              </div>
            ) : (
              <InternalLink href="/pricing" variation="pill">
                Choose your plan
              </InternalLink>
            )}
          </div>
        </Card>
        <Card title="Your Email">
          <p className="text-xl mt-8 mb-4 font-semibold">
            {user ? user.email : undefined}
          </p>
        </Card>
      </div>
      <div
        className="text-center border w-24 rounded"
        onClick={async () => {
          await supabaseClient.auth.signOut();
          router.push('/signin');
        }}
      >
        Sign out
      </div>
    </section>
  );
}
