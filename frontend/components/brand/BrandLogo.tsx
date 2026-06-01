import Link from 'next/link';

type BrandLogoProps = {
  dark?: boolean;
};

export function BrandLogo({ dark = false }: BrandLogoProps) {
  return (
    <Link className={`text-xl font-black tracking-normal ${dark ? 'text-ink' : 'text-white'}`} href="/">
      Reveal<span className="text-cyan">U</span>
    </Link>
  );
}
