import { supabaseAdmin } from '@/utils/supabase-admin';
import { GetStaticPropsResult } from 'next';
import { useUser } from 'utils/useUser';
import Image from 'next/image';
import Link from 'next/link';
import mobilebg from 'public/mobile-bg.png';
import desktopbg from 'public/desktop-bg.png';
import blackrose from 'public/brose.png';
import { getProducts } from '@/utils/callShopify';
import ProductList from '@/components/ProductList';

interface Props {
  publicImages: string[];
  products: any;
}

export default function HomePage({ publicImages, products }: Props) {
  return (
    <>
      <div className="py-20 relative z-10"></div>
    </>
  );
}
