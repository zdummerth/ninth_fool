import Pricing from 'components/Pricing';
import { getActiveProductsWithPrices } from 'utils/supabase-client';
import { GetServerSidePropsContext } from 'next';
import { Product } from 'types';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

interface Props {
  products: Product[];
}

export default function PricingPage({ products }: Props) {
  return (
    <div>
      <Pricing products={products} />
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const products = await getActiveProductsWithPrices();

  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };

  if (products) {
    return {
      props: {
        products
      }
    };
  } else {
    return {
      props: {
        products: []
      }
    };
  }
};
