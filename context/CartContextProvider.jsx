import React, { useState, useEffect, useContext } from 'react';
import { ShopifyData } from 'utils/callShopify';

export const CartContext = React.createContext();
export const useCart = () => useContext(CartContext);
const CartContextProvider = ({ children }) => {
  let initialCartState = {
    id: '',
    purchasedAt: false,
    checkoutUrl: '',
    lines: {
      edges: []
    }
  };

  const [cart, updateCart] = useState(initialCartState);
  // console.log({ cart });

  const setLoading = (loading, loadingLineItems = []) =>
    updateCart((prev) => ({ ...prev, loading, loadingLineItems }));

  const [error, setError] = useState({
    message: null
  });
  // console.log('CartContextProvider', cart.items.data)

  const initializeCart = async (reset) => {
    // Check for an existing cart.
    const isBrowser = typeof window !== 'undefined';
    const existingCartID = isBrowser ? localStorage.getItem('cart_id') : null;

    const setCartInState = (newCart) => {
      if (isBrowser) {
        localStorage.setItem('cart_id', newCart.id);
      }
      updateCart(newCart);
    };

    if (existingCartID && existingCartID !== 'undefined') {
      try {
        // console.log("finding cart", existingCartID);
        setLoading(true);

        const foundCart = await ShopifyData({
          query: `query getCart($id: ID!) {
            cart(id: $id) {
              id
              checkoutUrl
              createdAt
              estimatedCost {
                subtotalAmount {
                  amount
                  currencyCode
                }
                totalAmount {
                  amount
                  currencyCode
                }
              }
              lines(first: 100) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        quantityAvailable
                        availableForSale
                        product {
                          title
                        }
                        compareAtPriceV2 {
                          amount
                        }
                        image {
                          altText
                          height
                          id
                          src
                          width
                        }
                        priceV2 {
                          amount
                          currencyCode
                        }
                        title
                      }
                    }
                  }
                }
              }
              
            }
          }`,
          variables: {
            id: existingCartID
          }
        });

        // console.log('found cart', foundCart)

        // Make sure this cart hasn’t already been purchased.
        if (true) {
          setCartInState(foundCart.data.cart);
          setError((prev) => ({
            ...prev,
            message: null
          }));
          return;
        }
      } catch (e) {
        localStorage.removeItem('cart_id');
        setError((prev) => ({
          ...prev,
          message: 'Unable to create cart. Please reload to try again.'
        }));
      } finally {
        setLoading(false);
      }
    } else {
      try {
        // console.log('creating cart')
        setLoading(true);
        const res = await ShopifyData({
          query: `mutation cartCreate {
            cartCreate {
              cart {
                id
                checkoutUrl
                createdAt
                estimatedCost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                lines(first: 100) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                          title
                          product {
                            title
                            totalInventory
                          }
                          quantityAvailable
                          availableForSale
                          compareAtPriceV2 {
                            amount
                          }
                          image {
                            altText
                            height
                            id
                            src
                            width
                          }
                          priceV2 {
                            amount
                            currencyCode
                          }
                        }
                      }
                    }
                  }
                }
              }
              userErrors {
                field
                message
              }
            }
          }`
        });

        // console.log('created cart', res.data.cartCreate.cart)
        setCartInState(res.data.cartCreate.cart);
        setError((prev) => ({
          ...prev,
          message: null
        }));
      } catch (e) {
        console.log('creating cart error', e);
        localStorage.removeItem('cart_id');
        setError((prev) => ({
          ...prev,
          message: 'Unable to create cart. Please reload to try again.'
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  const BuyNow = async (input) => {
    try {
      const res = await ShopifyData({
        data: {
          query: `mutation checkoutCreate($input: CheckoutCreateInput!) {
            checkoutCreate(input: $input) {
              checkout {
                webUrl
              }
              checkoutUserErrors {
                code
                field
                message
              }
            }
          }`,
          variables: { input }
        }
      });

      const url = res.data.checkoutCreate.checkout.webUrl;
      // console.log('buy now url', url)
      return url;
    } catch (error) {
      console.log('buy now error', error);
    }
  };

  useEffect(() => {
    initializeCart(false);
  }, []);

  const cartLength = cart.lines.edges.reduce(
    (acc, cv) => acc + cv.node.quantity,
    0
  );
  // console.log('cart length', cartLength)

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLength,
        error: error.message,
        addToCart: async (lines) => {
          // console.log('variants tp add', variants)
          try {
            const res = await ShopifyData({
              query: `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
                cartLinesAdd(cartId: $cartId, lines: $lines) {
                  cart {
                    id
                    checkoutUrl
                    estimatedCost {
                      subtotalAmount {
                        amount
                        currencyCode
                      }
                      totalAmount {
                        amount
                        currencyCode
                      }
                    }
                    lines(first: 100) {
                      edges {
                        node {
                          id
                          quantity
                          merchandise {
                            ... on ProductVariant {
                              id
                              title
                              product {
                                title
                                totalInventory
                              }
                              quantityAvailable
                              availableForSale
                              compareAtPriceV2 {
                                amount
                              }
                              image {
                                altText
                                height
                                id
                                src
                                width
                              }
                              priceV2 {
                                amount
                                currencyCode
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  userErrors {
                    field
                    message
                  }
                }
              }
              `,
              variables: {
                cartId: cart.id,
                lines
              }
            });

            updateCart(res.data.cartLinesAdd.cart);
          } catch (error) {
            console.log('added to cart error', error);
          }
        },
        removeCartItems: async (lineIds) => {
          try {
            const res = await ShopifyData({
              query: `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
                  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                    cart {
                      id
                      checkoutUrl
                      estimatedCost {
                        subtotalAmount {
                          amount
                          currencyCode
                        }
                        totalAmount {
                          amount
                          currencyCode
                        }
                      }
                      lines(first: 100) {
                        edges {
                          node {
                            id
                            quantity
                            merchandise {
                              ... on ProductVariant {
                                id
                                title
                                product {
                                  title
                                  totalInventory
                                }
                                quantityAvailable
                                availableForSale
                                compareAtPriceV2 {
                                  amount
                                }
                                image {
                                  altText
                                  height
                                  id
                                  src
                                  width
                                }
                                priceV2 {
                                  amount
                                  currencyCode
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    userErrors {
                      field
                      message
                    }
                  }
                }
              `,
              variables: {
                cartId: cart.id,
                lineIds
              }
            });

            updateCart(res.data.cartLinesRemove.cart);
          } catch (error) {
            console.log('line item removed error', error);
          }
        },
        updateCartItem: async (lines) => {
          try {
            const res = await ShopifyData({
              query: `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
                  cartLinesUpdate(cartId: $cartId, lines: $lines) {
                    cart {
                      id
                      checkoutUrl
                      estimatedCost {
                        subtotalAmount {
                          amount
                          currencyCode
                        }
                        totalAmount {
                          amount
                          currencyCode
                        }
                      }
                      lines(first: 100) {
                        edges {
                          node {
                            id
                            quantity
                            merchandise {
                              ... on ProductVariant {
                                id
                                title
                                product {
                                  title
                                  totalInventory
                                }
                                quantityAvailable
                                availableForSale
                                compareAtPriceV2 {
                                  amount
                                }
                                image {
                                  altText
                                  height
                                  id
                                  src
                                  width
                                }
                                priceV2 {
                                  amount
                                  currencyCode
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    userErrors {
                      field
                      message
                    }
                  }
                }
              `,
              variables: {
                cartId: cart.id,
                lines
              }
            });

            updateCart(res.data.cartLinesUpdate.cart);
          } catch (error) {
            console.log('updated cart error', error);
          }
        },
        BuyNow
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
