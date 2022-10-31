import Pricing from 'components/Pricing';
import { getActiveProductsWithPrices } from 'utils/supabase-client';
import { GetStaticPropsResult } from 'next';
interface Props {
  products: any;
}

export default function PricingPage({ products }: Props) {
  // console.log(publicImages);
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
      // revalidate: 60
    };
  } else {
    return {
      props: {
        products: []
      }
    };
  }
}
