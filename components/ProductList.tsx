import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
// import useAvailability from '../../lib/useAvailability';

const getStyles = ({
  enlarge_first,
  action
}: {
  enlarge_first?: boolean;
  action: string;
}) => {
  const x_scroll = {
    container: `flex overflow-auto w-full p-2 sm:hidden`,
    child: `relative flex-shrink-0 mr-2 flex flex-col items-center group`,
    img_container: `relative w-20 h-20 rounded-full overflow-hidden border`,
    title: `w-full text-center w-24`
  };

  const basic_grid = {
    container: `w-full grid grid-cols-2 sm:grid-cols-3 gap-2`,
    child: `flex flex-col group border w-full`,
    img_container: `relative w-full aspect-[1/1]`,
    title: `w-full text-center`
  };

  const standard = {
    container: `w-full grid grid-cols-9 gap-2 center`,
    child: `relative border group bg-black aspect-[1/1] col-span-full sm:col-span-3 sm:row-span-3 hover:cursor-pointer
      ${enlarge_first && `first:sm:col-span-6 first:sm:row-span-6`}
      `,
    img_container: `relative w-full h-full`,
    title: `absolute bottom-0 bg-black/50 text-white w-full p-6 text-lg group-hover:text-xl group-hover:bg-emerald-500/75`
  };

  const x_scroll_then_grid = {
    container: `w-full flex overflow-auto sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-2`,
    child: `relative border group bg-black flex-shrink-0 w-64 h-64 sm:h-auto sm:w-auto sm:aspect-[1/1] mr-2 sm:mr-0 hover:cursor-pointer
      ${enlarge_first && `first:sm:col-span-6 first:sm:row-span-6`}
      `,
    img_container: `relative w-full h-full`,
    title: `absolute bottom-0 bg-black/50 text-white w-full p-6 text-lg group-hover:text-xl group-hover:bg-emerald-500/75`
  };

  switch (action) {
    case 'x_scroll': {
      return x_scroll;
    }
    case 'basic_grid': {
      return basic_grid;
    }
    case 'standard': {
      return standard;
    }
    case 'x_scroll_then_grid': {
      return x_scroll_then_grid;
    }
    default: {
      return standard;
    }
  }
};

function Product({ product, config }: { product: any; config: any }) {
  return (
    <Link href={`/product/${product.handle}`}>
      <a className={config.child}>
        <div className={config.img_container}>
          {product.images[0] && (
            <Image
              src={product.images[0].src}
              alt={product.title}
              layout="fill"
              objectFit="contain"
              className="group-hover:scale-110 transition-all duration-300"
            />
          )}
        </div>
        <div className={config.title}>{product.title}</div>
        <div>{product.price}</div>
      </a>
    </Link>
  );
}

export default function ProductList({
  products,
  heading,
  config = {
    enlarge_first: false,
    action: 'standard'
  },
  className
}: // config,
{
  products: any;
  config?: any;
  heading?: string;
  className?: string;
}) {
  const styles = getStyles(config);
  const tags = Array.from(new Set(products.map((p: any) => p.tags).flat()));
  const [filterOn, setFilterOn] = useState('all');
  const filteredProducts =
    filterOn === 'all'
      ? products
      : products.filter((p: any) => p.tags.includes(filterOn));

  return (
    <div className={`w-full ${className}`}>
      {heading && <h3 className="my-2 text-xl">{heading}</h3>}
      {config.showFilters && (
        <div>
          <div>Filter</div>
          <select
            onChange={(e: any) => setFilterOn(e.target.value)}
            value={filterOn}
            className="bg-black"
          >
            <option value="all">All</option>

            {tags.map((t: any) => (
              <option value={t} key={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className={styles.container}>
        {filteredProducts.map((c: any, ind: number) => (
          <Product key={c.id} product={c} config={styles} />
        ))}
      </div>
    </div>
  );
}
