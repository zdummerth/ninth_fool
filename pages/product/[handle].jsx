import ProductCard from 'components/ProductCard';
import { getProduct, ShopifyData } from 'utils/callShopify';

function Product({ product }) {
  console.log(product);
  return (
    <div>
      <ProductCard product={product} />
    </div>
  );
}

// This function gets called at build time
export async function getStaticPaths() {
  const handles = await ShopifyData({
    query: `{
        products(first: 250) {
          edges {
            node {
                handle
            }
          }
        }
      }`
  });

  const paths = handles.data.products.edges.map(({ node }) => ({
    params: { handle: node.handle }
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const data = await getProduct(params.handle);

  return {
    props: {
      product: data
    }
  };
}

export default Product;
