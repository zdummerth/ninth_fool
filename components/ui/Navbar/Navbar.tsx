import Link from 'next/link';
import { useUser } from 'utils/useUser';
import logoSvg from 'public/logo-white-2.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import usePostsMeta from '@/utils/usePostsMeta';
import Cart from 'components/Cart';

const Navbar = () => {
  const { user, subscription, isLoading } = useUser();
  const { data: postData, error: postError } = usePostsMeta();
  const router = useRouter();
  const linkClassName = 'px-3 py-1 rounded bg-black/90';
  const navClassname =
    router.pathname === '/'
      ? 'absolute top-0 left-0 z-20 w-full bg-transparent'
      : '';

  return (
    <nav className={navClassname}>
      <div className="mx-auto max-w-6xl px-4 ">
        <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
          <div className="flex flex-1 items-center">
            <Link href="/">
              <a className={`w-12`} aria-label="Logo">
                <Image src={logoSvg} layout="responsive" priority />
              </a>
            </Link>
          </div>

          <div className="flex space-x-2">
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
