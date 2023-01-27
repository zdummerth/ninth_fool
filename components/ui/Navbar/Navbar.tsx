import Link from 'next/link';
import { useUser } from 'utils/useUser';
import Menu from 'components/icons/Menu';
import X from 'components/icons/X';
import logoSvg from 'public/logo-white-2.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Cart from 'components/Cart';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, subscription, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const linkClassName =
    'px-3 py-3 md:py-1 border-t last:border-b md:border-none flex justify-center';
  // const navClassname = router.pathname === '/' ? '' : '';
  const navClassname = 'relative z-40 bg-black h-16';

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.asPath]);
  const links = (
    <>
      {user && !subscription && !isLoading ? (
        <Link href="/pricing">
          <a className={linkClassName}>Subscribe</a>
        </Link>
      ) : user && subscription ? (
        <Link href="/feed">
          <a className={linkClassName}>Feed</a>
        </Link>
      ) : null}
      <Link href="/blog">
        <a className={linkClassName}>Blog</a>
      </Link>
      {user ? (
        <Link href="/account">
          <a className={linkClassName}>Account</a>
        </Link>
      ) : (
        <Link href="/signin">
          <a className={linkClassName}>Sign in</a>
        </Link>
      )}
      <div className={linkClassName}>
        <Cart />
      </div>
    </>
  );

  return (
    <nav className={navClassname}>
      <div className="mx-auto max-w-6xl h-full">
        <div className="flex justify-between align-center flex-row h-full">
          <div className="flex items-center pl-4">
            <Link href="/">
              <a className={`w-12`} aria-label="Logo">
                <Image src={logoSvg} layout="responsive" priority />
              </a>
            </Link>
          </div>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="mr-4 md:hidden"
          >
            {isOpen ? <X /> : <Menu />}
          </button>

          <div
            className={`${
              !isOpen ? 'hidden' : 'flex flex-col'
            } absolute top-16 w-full bg-black md:hidden`}
          >
            {links}
          </div>

          <div className="hidden lg:flex space-x-2 items-center">{links}</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
