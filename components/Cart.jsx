import React, { useState } from 'react';
import { useCart } from '../context/CartContextProvider';
import LineItem from './LineItem';
import Price from './Price';
import CartIcon from '../components/icons/Cart';

export default function CartComponent() {
  const {
    cart: {
      lines: { edges },
      checkoutUrl,
      estimatedCost
    },
    cartLength
  } = useCart();

  const [isCartOpen, toggleCart] = useState(false);

  return (
    <div className="">
      <button
        type="button"
        // disabled={cartLength === 0}
        onClick={() => toggleCart(true)}
        className="flex"
      >
        {/* <div>Cart</div> */}
        <CartIcon />
        <div className="ml-2">{`(${cartLength})`}</div>
      </button>
      {isCartOpen && (
        <div className="fixed w-full h-full top-0 right-0 z-20 bg-black/75">
          <div className=" w-3/4 lg:w-1/3 bg-black h-full absolute right-0 p-2">
            <div className="w-full">
              <button
                type="button"
                onClick={() => toggleCart(false)}
                className="flex fai-c"
              >
                close
              </button>
            </div>
            <h3 className="my-6 border-b-2 pb-2">Your Cart</h3>
            {cartLength === 0 ? (
              <div>Your Cart Is Empty</div>
            ) : (
              <div>
                <div>
                  <div className="flex">
                    <i className="mr-2">Total:</i>
                    <Price price={estimatedCost.totalAmount.amount} />
                  </div>
                </div>
                <a
                  href={checkoutUrl}
                  className="block border rounded p-4 text-center my-6 bg-green-300 text-black"
                >
                  Proceed to Checkout
                </a>
                <div className="grid grid-cols-1 gap-2">
                  {edges.map(({ node }) => (
                    <LineItem key={node.id} lineItem={node} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
