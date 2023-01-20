// bodytemplate
// {
//   "query": "...",
//   "operationName": "...",
//   "variables": { "myVariable": "someValue", ... }
// }
export async function ShopifyData(body) {
  const URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2021-07/graphql.json`;

  const options = {
    endpoint: URL,
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token':
        process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };

  try {
    const data = await fetch(URL, options).then((response) => {
      return response.json();
    });

    return data;
  } catch (error) {
    throw new Error('Products not fetched');
  }
}

const createTagsQuery = (tags) => tags.map((t) => `tag:"${t}"`).join(' OR ');

export const getProduct = async (handle) => {
  try {
    const response = await ShopifyData({
      query: `query getProduct($handle: String!) {
          product(handle: $handle) {
            id
            title
            handle
            publishedAt
            availableForSale
            tags
            title
            totalInventory
            descriptionHtml
            options {
              name
              values
            }
            images(first: 5) {
              edges {
                node {
                  altText
                  height
                  id
                  src
                  width
                }
              }
            }
            variants(first: 30) {
              edges {
                node {
                  id
                  availableForSale
                  title
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
        }`,
      variables: { handle }
    });
    // console.log(response.body.data.collections);

    const product = {
      ...response?.data.product,
      images: response?.data.product.images.edges.map(({ node }) => node),
      variants: response?.data.product.variants.edges.map(({ node }) => node)
    };

    // console.log(collections);

    return product;
  } catch (e) {
    throw e;
  }
};

export const getRelatedProducts = async (id) => {
  try {
    const response = await ShopifyData({
      query: `query getProductRecommendations($id: ID!) {
          productRecommendations(productId: $id) {
            id
            title
            handle
            publishedAt
            availableForSale
            tags
            title
            totalInventory
            descriptionHtml
            images(first: 2) {
              edges {
                node {
                  altText
                  height
                  id
                  src
                  width
                }
              }
            }
          }
        }`,
      variables: { id }
    });
    // console.log(response.body.data.collections);

    const products = response.body?.data.productRecommendations;

    // console.log(collections);

    return products;
  } catch (e) {
    throw e;
  }
};

export const getCollections = async ({ first = 1, query = '' }) => {
  try {
    const response = await ShopifyData({
      query: `query ($first: Int, $query: String) {
        collections(first: $first, query: $query) {
          edges {
            node {
              id
              title
              handle
              image {
                height
                width
                id
                url
                src
                altText
              }
            }
          }
        }
      }`,
      variables: {
        first,
        query
      }
    });
    // console.log(response.body.data.collections);

    const collections = response.body?.data.collections.edges.map(
      ({ node }) => node
    );

    // console.log(collections);

    return collections;
  } catch (e) {
    throw e;
  }
};

export const getProducts = async ({ first = 1, tags = [] }) => {
  try {
    const response = await ShopifyData({
      query: `query ($first: Int, $query: String) {
        products(first: $first, query: $query) {
          edges {
            node {
              id
              title
              handle
              tags
              options {
                name
                values
              }
              images(first: 2) {
                edges {
                  node {
                    altText
                    height
                    id
                    src
                    width
                  }
                }
              }
            }
          }
        }
      }`,
      variables: {
        first,
        tags: tags.length > 0 ? createTagsQuery(tags) : ''
      }
    });
    // console.log(response.data.products.edges);

    const products = response?.data.products.edges.map(({ node }) => ({
      ...node,
      images: node.images.edges.map(({ node }) => node)
    }));

    return products;
  } catch (e) {
    throw e;
  }
};

export const getCollectionByHandle = async ({ first = 1, handle = '' }) => {
  try {
    const response = await ShopifyData({
      query: `query getCollection($first: Int, $handle: String!) {
          collection(handle: $handle) {
            id
            title
            handle
            products(first: $first) {
              edges {
                node {
                  id
                  title
                  handle
                  tags
                  options {
                    name
                    values
                  }
                  images(first: 2) {
                    edges {
                      node {
                        altText
                        height
                        id
                        src
                        width
                      }
                    }
                  }
                }
              }
            }
          }
        }
        
        `,
      variables: {
        first,
        handle
      }
    });
    // console.log(response.body);

    const collection = {
      ...response.body?.data.collection,
      products: response.body?.data.collection.products.edges.map(
        ({ node }) => ({
          ...node,
          images: node.images.edges.map(({ node }) => node)
        })
      )
    };

    return collection;
  } catch (e) {
    console.log(e);
    // throw e;
  }
};

export const getProductAvailabilty = async (id) => {
  try {
    const response = await ShopifyData({
      query: `query ($id: ID) {
          product(id: $id) {
            id
            title
            totalInventory
            availableForSale
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  currentlyNotInStock
                  quantityAvailable
                }
              }
            }
          }
        }`,
      variables: {
        id
      }
    });
    // console.log(response.body);

    const product = {
      ...response.body?.data.product,
      variants: response.body?.data.product.variants.edges.map(
        ({ node }) => node
      )
    };

    return product;
  } catch (e) {
    console.log(e);
    // throw e;
  }
};
