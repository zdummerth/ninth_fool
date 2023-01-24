import 'styles/main.css';
import 'styles/chrome-bug.css';
import { useEffect, useState } from 'react';
import React from 'react';
import Layout from 'components/Layout';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { AppProps } from 'next/app';
import { MyUserContextProvider } from 'utils/useUser';
import type { Database } from 'types_db';
import CartContextProvider from '../context/CartContextProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <React.StrictMode>
      <CartContextProvider>
        <SessionContextProvider supabaseClient={supabaseClient}>
          <MyUserContextProvider>
            <Layout>
              <ToastContainer position="top-center" theme="dark" />
              <Component {...pageProps} />
            </Layout>
          </MyUserContextProvider>
        </SessionContextProvider>
      </CartContextProvider>
    </React.StrictMode>
  );
}
