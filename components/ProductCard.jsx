import React, { useState } from 'react';
import { useCart } from 'context/CartContextProvider';
import Price from './Price';
import Image from 'next/image';
import { toast } from 'react-toastify';

const LineItem = ({ image, name }) => {
  return (
    <div className="flex items-center">
      <div className="relative w-20 h-20 mr-2">
        <Image src={image.src} alt={'test'} layout="fill" objectFit="contain" />
      </div>
      <div className="flex flex-col items-center">
        <div>{`${name}`}</div>
        <div>added to cart</div>
      </div>
    </div>
  );
};

const VariantPicker = ({
  product,
  currentVariant,
  setCurrentVariant,
  setCurrentImage
}) => {
  // console.log('product variants', product.variants.edges)
  const [isLoading, setIsLoading] = useState({
    adding: false,
    buying: false
  });

  const [error, setError] = useState(false);
  const [qty, setQty] = useState(1);

  const { BuyNow, addToCart } = useCart();

  const handleSelectChange = (e) => {
    const selectedTitle = e.target.value;
    const selectedVariant = product.variants.find(
      (v) => v.title === selectedTitle
    );

    console.log(selectedVariant);
    if (selectedVariant) {
      setCurrentVariant(selectedVariant);
      if (selectedVariant?.image) {
        setCurrentImage(selectedVariant.image);
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.value === '') {
      setQty('');
    } else if (Number.isInteger(parseInt(e.target.value))) {
      setQty(parseInt(e.target.value));
    }
    return;
  };

  const quantity = qty;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (e.currentTarget.id === 'buy-now') {
        setIsLoading({ ...isLoading, buying: true });
        const checkoutUrl = await BuyNow({
          lineItems: [{ variantId: currentVariant.id, quantity }]
        });
        window.location.href = checkoutUrl;
      } else if (e.currentTarget.id === 'add-to-cart') {
        setIsLoading({ ...isLoading, adding: true });
        await addToCart([{ quantity, merchandiseId: currentVariant.id }]);
        toast.success(
          <div className="">
            <LineItem
              image={currentVariant.image}
              name={`${product.title} - ${
                currentVariant.title !== 'Default Title' && currentVariant.title
              }`}
            />
          </div>,
          {
            autoClose: 2000,
            closeOnClick: true
          }
        );
        setIsLoading({
          adding: false,
          buying: false
        });
      }
    } catch (e) {
      setError(e);
      setIsLoading({
        adding: false,
        buying: false
      });
    }
  };

  if (!currentVariant) {
    return <div>This Product Is Sold Out</div>;
  }

  return (
    <form className="">
      <h3 className="text-xl">{product.title}</h3>
      <div className="">
        <Price price={currentVariant.priceV2.amount} />
      </div>
      {currentVariant.title !== 'Default Title' && (
        <div className="my-4">
          <p>Select Details</p>
          <select
            name="variant_select"
            id="variant_select"
            onChange={handleSelectChange}
            value={currentVariant.title}
            className={`p-2 bg-black w-full mt-2`}
          >
            {product.variants.map((v) => (
              <option key={v.id} value={v.title} data-variant-id={v.id}>
                {v.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="">
        <div>
          <div className="flex flex-col">
            <div className="">Quantity:</div>
            <input
              className="p-2 bg-black w-full mt-2"
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={qty}
              onChange={handleChange}
            />
          </div>

          <div className="">
            <button
              type="submit"
              name="add_to_cart"
              id="add-to-cart"
              className="p-2 border w-full mt-4"
              onClick={handleSubmit}
              disabled={isLoading.adding || isLoading.buying}
            >
              {isLoading.adding ? '...Adding' : 'Add To Cart'}
            </button>
            <div className="w-25px"></div>
            <button
              type="submit"
              name="buy-now"
              id="buy-now"
              className="p-2 border w-full my-4"
              onClick={handleSubmit}
              disabled={isLoading.adding || isLoading.buying}
            >
              {isLoading.buying ? '...Loading' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const Thumbnails = ({
  images,
  variants,
  setCurrentImage,
  setCurrentVariant
}) => {
  const findVariant = (e) => {
    const id = e.currentTarget.id;
    // console.log(e.currentTarget.id);
    // console.log({ variants });
    const selectedVariant = variants.find((v) => v.image.id === id);
    if (selectedVariant) {
      // setCurrentVariant(selectedVariant);
      if (selectedVariant.image) {
        setCurrentImage(selectedVariant.image);
      }
    } else {
      setCurrentImage(images.find((img) => img.id === id));
    }
    console.log({ selectedVariant });
  };
  return (
    <div className="grid grid-flow-col md:grid-flow-row md:grid-cols-4 w-full justify-start overflow-auto my-2 gap-2">
      {images.map((image) => (
        <button
          onClick={findVariant}
          key={image.id}
          id={image.id}
          className="relative w-24 h-24 border"
        >
          <Image src={image.src} alt="test" layout="fill" objectFit="contain" />
        </button>
      ))}
    </div>
  );
};
const Product = ({ product, recommendedProducts }) => {
  // console.log("product", recommendedProducts);
  const { variants, images } = product;
  const firstAvailableVariant = variants.find((v) => v.availableForSale);

  const [currentVariant, setCurrentVariant] = useState(firstAvailableVariant);

  const [currentImage, setCurrentImage] = useState(product.images[0]);

  // console.log({ currentVariant });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full md:p-4">
      <div>
        <div className="relative w-full aspect-[1/1]">
          <Image
            src={currentImage.src}
            alt="test"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <Thumbnails
          images={images}
          variants={variants}
          setCurrentImage={setCurrentImage}
          setCurrentVariant={setCurrentVariant}
        />
      </div>

      <div className="p-2 w-full max-w-md place-self-center">
        {currentVariant ? (
          <VariantPicker
            product={product}
            currentVariant={currentVariant}
            setCurrentVariant={setCurrentVariant}
            setCurrentImage={setCurrentImage}
          />
        ) : (
          <div className="text-xl border border-red-700 p-4 text-center">
            Sold Out
          </div>
        )}
        {product.descriptionHtml && (
          <div
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            className="my-4"
          />
        )}
      </div>
    </div>
  );
};

export default Product;
