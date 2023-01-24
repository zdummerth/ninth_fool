import Link from 'next/link';
import Logo from 'components/ui/Logo';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] px-6 bg-zinc-900 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-zinc-600 py-12 text-white transition-colors duration-150 bg-zinc-900">
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-initial flex-col md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className="text-white font-bold hover:text-zinc-200 transition ease-in-out duration-150">
                Quick Links
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="/">
                <a className="text-white hover:text-zinc-200 transition ease-in-out duration-150">
                  Home
                </a>
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="/">
                <a className="text-white hover:text-zinc-200 transition ease-in-out duration-150">
                  About
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-initial flex-col md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className="text-white font-bold hover:text-zinc-200 transition ease-in-out duration-150">
                LEGAL
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="/">
                <a className="text-white hover:text-zinc-200 transition ease-in-out duration-150">
                  Privacy Policy
                </a>
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="/">
                <a className="text-white hover:text-zinc-200 transition ease-in-out duration-150">
                  Terms of Use
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="py-12 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <div className="w-24 mb-4">
            <Logo />
          </div>
          <span>The Ninth Fool</span>
        </div>
      </div>
    </footer>
  );
}
