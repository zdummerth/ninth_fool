import Link from 'next/link';
import { useUser } from 'utils/useUser';
import logoSvg from 'public/logo-white.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Navbar = () => {
  const { user, subscription, isLoading } = useUser();
  const router = useRouter();
  const linkClassName = 'px-3 py-1 rounded bg-black/90';
  const navClassname =
    router.pathname === '/'
      ? 'absolute top-0 left-0 z-20 w-full bg-transparent'
      : '';

  return (
    <nav className={navClassname}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
          <div className="flex flex-1 items-center">
            <Link href="/">
              <a className={`w-12`} aria-label="Logo">
                <Image src={logoSvg} layout="responsive" priority />
              </a>
            </Link>
          </div>

          <div className="space-x-8">
            {user && !subscription && !isLoading ? (
              <Link href="/pricing">
                <a className={linkClassName}>Subscribe</a>
              </Link>
            ) : user && subscription ? (
              <Link href="/feed">
                <a className={linkClassName}>Feed</a>
              </Link>
            ) : null}
            {user ? (
              <Link href="/account">
                <a className={linkClassName}>Account</a>
              </Link>
            ) : (
              <Link href="/signin">
                <a className={linkClassName}>Sign in</a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
