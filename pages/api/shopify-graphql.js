import { ShopifyData } from 'utils/callShopify';

export default async function handler(req, res) {
  console.log('in shopify function', req.body);

  try {
    const data = await ShopifyData(req.body);

    console.log('shopify response data', data);

    res.status(200).json(data);
  } catch (error) {
    console.log('ERROR IN SHOPIFY GRAPHQL API ROUTE: ', error);
    res.status(400).send();
  }
}
