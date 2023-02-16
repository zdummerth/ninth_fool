import Link from 'next/link';

const variations: any = {
  blank: '',
  pill: `block py-2 px-4 my-8 rounded-full text-center shadow shadow-black bg-white hover:bg-gray-600 hover:text-white text-black font-semibold`,
  simple: 'text-white hover:text-zinc-200 transition ease-in-out duration-150'
};

export default function InternalLink({
  href,
  variation = 'blank',
  children
}: any) {
  return (
    <Link href={href}>
      <a className={variations[variation]}>{children}</a>
    </Link>
  );
}
