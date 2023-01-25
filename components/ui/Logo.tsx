import logoSvg from 'public/logo-white-2.png';
import Image from 'next/image';

const Logo = () => {
  return <Image src={logoSvg} layout="responsive" priority />;
};

export default Logo;
