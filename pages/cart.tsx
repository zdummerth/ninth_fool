import { GetStaticPropsResult } from 'next';
import { getProducts } from '@/utils/callShopify';
import ProductList from '@/components/ProductList';
import Cart from '@/components/Cart';
import { ShopifyProduct } from 'types';
import { useCart } from 'context/CartContextProvider';

interface Props {
  products: ShopifyProduct[];
}

export default function CartPage({ products }: Props) {
  const { cartLength } = useCart();
  return (
    <>
      <div className="">
        {cartLength > 0 ? (
          <Cart />
        ) : (
          <div className="text-xl text-center">
            <p className="py-10">Your Cart Is Empty</p>
            <p className="pb-10">Check Out These Products</p>
            <div className="mx-2">
              <ProductList products={products} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const allProducts = await getProducts({ first: 5 });

  if (allProducts) {
    return {
      props: {
        products: allProducts
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
