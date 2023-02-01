import Pricing from 'components/Pricing';
import { getActiveProductsWithPrices } from 'utils/supabase-client';
import { GetStaticPropsResult } from 'next';
import { Product } from 'types';

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

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const products = await getActiveProductsWithPrices();

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
}
