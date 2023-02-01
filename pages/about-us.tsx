import { useUser } from 'utils/useUser';
import Image from 'next/image';
import Link from 'next/link';
import forest from 'public/color-forest.png';
import Seo from '@/components/SEO';

export default function AboutPage() {
  const { user, subscription, isLoading } = useUser();

  const linkClassName =
    'block p-2 my-8 w-64 rounded-xl text-center shadow shadow-white bg-emerald-500 color black';

  return (
    <>
      <Seo
        title="About Us"
        description={`Welcome to The Ninth Fool, where creativity and art come together to inspire and beautify your life! We are a team of passionate artists and art lovers, dedicated to bringing you the best in digital art prints.`}
      />
      <div className="relative">
        <div className="relative text-center rounded overflow-hidden py-20">
          <div className="absolute top-0 left-0 w-full h-full">
            <Image
              src={forest}
              layout="fill"
              objectFit="cover"
              className=""
              priority
            />
          </div>
          <h1 className="text-3xl md:text-5xl mb-8 font-bold text-shadow-dark relative z-10">
            About Us
          </h1>
        </div>

        <div className="p-4 text-xl max-w-xl mx-auto m-2">
          <p className="mt-10">
            Welcome to The Ninth Fool, where creativity and art come together to
            inspire and beautify your life! We are a team of passionate artists
            and art lovers, dedicated to bringing you the best in digital art
            prints.
          </p>
          <p className="mt-4">
            Our mission is to make art accessible and affordable for everyone,
            and we believe that the digital realm is the perfect platform to do
            so. With The Ninth Fool, you can have the best art prints from
            around the world at your fingertips. Our membership program allows
            you to download unlimited digital art prints for a low monthly fee,
            giving you access to an ever-growing library of stunning artwork.
          </p>
          <p className="mt-4">
            Whether you're looking to decorate your home, office, or just need
            some inspiration, our diverse collection has something for everyone.
            From contemporary to classical, abstract to realism, our art prints
            are carefully curated to ensure that you receive the highest quality
            pieces.
          </p>
          <p className="mt-4">
            We understand that art is a personal experience, and that's why we
            offer a risk-free membership. You can cancel at any time, no
            questions asked. Our goal is to make sure you're completely
            satisfied with your membership and your experience with The Ninth
            Fool.
          </p>
          <p className="mt-4">
            So why wait? Join us today and start downloading beautiful digital
            art prints. Whether you're a seasoned art collector or just starting
            your collection, The Ninth Fool is the perfect place to discover,
            download and enjoy the beauty of art.
          </p>
          <div className="flex justify-center">
            {user && subscription && !isLoading && (
              <Link href="/feed">
                <a className={linkClassName}>View Images</a>
              </Link>
            )}
            {user && !subscription && !isLoading && (
              <Link href="/pricing">
                <a className={linkClassName}>Subscribe Now</a>
              </Link>
            )}
            {!user && !isLoading && (
              <Link href="/signin">
                <a className={linkClassName}>Sign Up Now</a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
