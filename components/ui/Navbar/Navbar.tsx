import Link from 'next/link';
import { useUser } from 'utils/useUser';
import logoSvg from 'public/logo-white-2.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Cart from 'components/Cart';
import { useState, useEffect, useRef } from 'react';
import HamburgerToX from '@/components/HamburgerToX';
import useOnClickOutside from '@/utils/useOnClickOutside';

const Navbar = () => {
  const { user, subscription, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const linkClassName =
    'px-3 py-3 md:py-1 border-t last:border-b md:border-none flex justify-center';

  const mobileRef = useRef<HTMLInputElement>(null);
  useOnClickOutside(mobileRef, () => setIsOpen(false));

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
    <>
      <nav ref={mobileRef} className="relative z-40 bg-black h-16">
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
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              className="mr-4 md:hidden"
            >
              <HamburgerToX isOpen={isOpen} />
            </button>

            <div
              className={`flex flex-col fixed top-16 w-3/4 h-screen bg-black md:hidden transition-all ease-in-out duration-500 overflow-hidden ${
                !isOpen ? '-right-full' : 'right-0'
              }`}
            >
              {links}
            </div>

            <div className="hidden lg:flex space-x-2 items-center">{links}</div>
          </div>
        </div>
      </nav>
      {isOpen && (
        <style>
          {`
          body {
            overflow: hidden;
          }
        `}
        </style>
      )}
    </>
  );
};

export default Navbar;
