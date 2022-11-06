import Link from 'next/link';
import s from './Navbar.module.css';

import Logo from 'components/icons/Logo';
import { useRouter } from 'next/router';
import { useUser } from 'utils/useUser';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const Navbar = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user, subscription, isLoading } = useUser();

  return (
    <nav>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
          <div className="flex flex-1 items-center">
            <Link href="/">
              <a className={s.logo} aria-label="Logo">
                <Logo />
              </a>
            </Link>
          </div>

          <div className="flex flex-1 justify-end space-x-8">
            {user && !subscription ? (
              <Link href="/pricing">
                <a className={s.link}>Subscribe</a>
              </Link>
            ) : user && subscription ? (
              <Link href="/feed">
                <a className={s.link}>Feed</a>
              </Link>
            ) : null}
            {user ? (
              <Link href="/account">
                <a className={s.link}>Account</a>
              </Link>
            ) : (
              <Link href="/signin">
                <a className={s.link}>Sign in</a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
