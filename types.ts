import Stripe from 'stripe';
export interface PageMeta {
  title: string;
  description: string;
  cardImage: string;
}

export interface Customer {
  id: string /* primary key */;
  stripe_customer_id?: string;
}

export interface Product {
  id: string /* primary key */;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Stripe.Metadata;
}

export interface ProductWithPrice extends Product {
  prices?: Price[];
}

export interface UserDetails {
  id: string /* primary key */;
  first_name: string;
  last_name: string;
  full_name?: string;
  avatar_url?: string;
  billing_address?: Stripe.Address;
  payment_method?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
}

export interface Price {
  id: string /* primary key */;
  product_id?: string /* foreign key to products.id */;
  active?: boolean;
  description?: string;
  unit_amount?: number;
  currency?: string;
  type?: Stripe.Price.Type;
  interval?: Stripe.Price.Recurring.Interval;
  interval_count?: number;
  trial_period_days?: number | null;
  metadata?: Stripe.Metadata;
  products?: Product;
}

export interface PriceWithProduct extends Price {}

export interface Subscription {
  id: string /* primary key */;
  user_id: string;
  status?: Stripe.Subscription.Status;
  metadata?: Stripe.Metadata;
  price_id?: string /* foreign key to prices.id */;
  quantity?: number;
  cancel_at_period_end?: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at?: string;
  cancel_at?: string;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  prices?: Price;
}

export interface BlogPostMetaData {
  tags: string[];
  title: string;
  featured_image: string;
  slug: string;
}

export interface PaidImage {
  id: number;
  filepath: string;
  signedUrl: string;
  path: string;
  signedURL: string;
  tagstring: string;
  height: number;
  width: number;
  error: any;
}

export interface ImagePageData {
  count: number;
  images: PaidImage[];
  statusText: string;
}

export interface ShopifyOption {
  name: string;
  values: string[];
}

export interface ShopifyImage {
  altText?: string;
  height: number;
  width: number;
  id: string;
  src: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  tags: string[];
  options: ShopifyOption[];
  images: ShopifyImage[];
}

export interface TagForSearch {
  name: string;
  label: string;
  count: number;
  value: string;
}
