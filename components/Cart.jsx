import React from 'react';
import { useCart } from 'context/CartContextProvider';
import LineItem from './LineItem';
import Price from './Price';

export default function CartComponent() {
  const {
    cart: {
      lines: { edges },
      checkoutUrl,
      estimatedCost
    }
  } = useCart();

  return (
    <div className="p-2 text-center">
      <h3 className="my-6 border-b-2 pb-2 text-2xl">Your Cart</h3>
      <div className="max-w-2xl m-auto">
        <div>
          <div className="flex">
            <i className="mr-2">Total:</i>
            <Price price={estimatedCost.totalAmount.amount} />
          </div>
        </div>
        <a
          href={checkoutUrl}
          className="block rounded p-2 my-6 text-center shadow shadow-black bg-white hover:bg-gray-600 hover:text-white text-black font-semibold"
        >
          Proceed to Checkout
        </a>
        <div className="grid grid-cols-1 gap-2">
          {edges.map(({ node }) => (
            <LineItem key={node.id} lineItem={node} />
          ))}
        </div>
      </div>
    </div>
  );
}
