import logoSvg from 'public/nf-logo.png';
import Image from 'next/image';

const Logo = () => {
  return <Image src={logoSvg} layout="responsive" priority />;
};

export default Logo;
