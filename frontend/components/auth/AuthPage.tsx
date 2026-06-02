import AuthCard from './AuthCard';
import { MainNavbar } from '../layout/MainNavbar';

type AuthPageProps = {
  mode: 'login' | 'register';
};

const bars = [22, 38, 35, 50, 64, 86, 42, 72, 92, 78, 30];

function ChartAsset() {
  return (
    <figure className="chart-card relative mt-12 overflow-hidden rounded-xl border border-white/10 px-7 pb-8 pt-9 shadow-[0_22px_50px_rgba(16,10,28,0.2)]">
      <div className="absolute inset-x-6 bottom-9 h-px bg-cyan/55" />
      <div className="absolute inset-x-6 bottom-14 h-px bg-fuchsia-400/18" />
      <div className="absolute inset-x-6 bottom-20 h-px bg-cyan/12" />
      <div className="flex h-40 items-end justify-center gap-3">
        {bars.map((height, index) => (
          <span
            aria-hidden="true"
            className={`bar ${index > 5 ? 'bg-cyan text-cyan' : 'bg-fuchsia-500 text-fuchsia-500'}`}
            key={`${height}-${index}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <figcaption className="sr-only">A neon magenta and cyan bar chart representing feedback progress.</figcaption>
    </figure>
  );
}

function LeftBanner() {
  return (
    <section className="glass-panel relative z-10 w-full max-w-[30rem] rounded-[1.7rem] px-8 py-9 sm:px-9 lg:px-10">
      <div className="absolute -left-20 -top-32 hidden size-28 rounded-3xl bg-ink/70 p-7 shadow-glass md:block">
        <div className="mini-orb size-full rounded-full" />
      </div>
      <p className="text-3xl font-black text-violet">
        Reveal<span className="text-cyan">U</span>
      </p>
      <h1 className="mt-3 max-w-72 text-xl font-bold leading-7 text-ink/72">
        Gamified Feedback.
        <span className="block">Level up your team.</span>
      </h1>
      <ChartAsset />
      <div className="mt-9 flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] text-ink/55">
        <span className="rounded bg-cyan px-1.5 py-0.5 text-[0.62rem] text-white">XP</span>
        Join 10K+ Ninjas
      </div>
    </section>
  );
}

export default function AuthPage({ mode }: AuthPageProps) {
  return (
    <div className="min-h-screen bg-app text-ink">
      <MainNavbar authHref={mode === 'login' ? '/register' : '/login'} authLabel={mode === 'login' ? 'Register' : 'Login'} showNavLinks={false} />
      <main className="auth-stage relative min-h-[calc(100vh-3.5rem)] overflow-hidden px-5 pb-16 pt-16 sm:px-8 lg:px-10">
        <div className="planet absolute bottom-24 right-[6%] hidden size-40 rounded-full shadow-[0_28px_70px_rgba(26,83,88,0.22)] md:block" />
        <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-5xl items-center gap-8 lg:grid-cols-[1.02fr_0.95fr]">
          <LeftBanner />
          <AuthCard initialMode={mode} />
        </div>
      </main>
    </div>
  );
}
