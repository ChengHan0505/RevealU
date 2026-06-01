import type { ComponentPropsWithoutRef } from 'react';

type SurfaceCardProps = ComponentPropsWithoutRef<'section'> & {
  className?: string;
};

export function SurfaceCard({ children, className = '', ...props }: SurfaceCardProps) {
  return (
    <section className={`rounded-2xl border border-white/70 bg-white/78 shadow-soft backdrop-blur ${className}`} {...props}>
      {children}
    </section>
  );
}
