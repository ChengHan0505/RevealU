import Link from 'next/link';
import { MainNavbar } from '../layout/MainNavbar';

const steps = [
  {
    title: 'Launch Session',
    description: 'Create a feedback round, add your team, and share the session link.'
  },
  {
    title: 'Play the Game',
    description: 'Rate teammates with structured, lightweight peer evaluation criteria.'
  },
  {
    title: 'Reveal Results',
    description: 'See leaderboards and aggregate team performance instantly.'
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-app text-ink">
      <MainNavbar />
      <main>
        <section className="auth-stage px-6 py-16 sm:px-10 lg:px-12">
          <div className="mx-auto grid min-h-[26rem] max-w-6xl items-center gap-12 md:grid-cols-[1fr_0.9fr]">
            <article>
              <p className="mb-4 inline-flex rounded-full bg-night px-3 py-1 text-xs font-black text-cyan">Level Up Your Team</p>
              <h1 className="max-w-xl text-5xl font-black leading-tight tracking-normal text-violet sm:text-6xl">
                Gamified <span className="text-cyan">Peer Feedback</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm font-semibold leading-6 text-ink/58">
                Transform performance reviews into a playful feedback ritual. Build stronger teams with sessions, scoring, and result dashboards.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="rounded-md bg-violet px-6 py-3 text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5" href="/register">
                  Start a Session
                </Link>
                <Link className="rounded-md bg-night px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:text-cyan" href="/login">
                  Login
                </Link>
              </div>
            </article>
            <div className="chart-card relative min-h-72 overflow-hidden rounded-2xl border border-white/10 p-8 shadow-soft">
              <div className="absolute inset-x-8 bottom-12 h-px bg-cyan/55" />
              <div className="flex h-56 items-end justify-center gap-4">
                {[30, 48, 40, 58, 76, 92, 55, 80, 100, 86].map((height, index) => (
                  <span
                    className={`w-4 rounded-t ${index > 5 ? 'bg-cyan text-cyan' : 'bg-fuchsia-500 text-fuchsia-500'} shadow-[0_0_18px_currentColor]`}
                    key={`${height}-${index}`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-night px-6 py-10 text-white sm:px-10 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-black">The Feedback Loop, <span className="text-cyan">Evolved</span></h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <article className="rounded-2xl bg-white/6 p-6 ring-1 ring-white/8" key={step.title}>
                  <span className="grid size-8 place-items-center rounded-md bg-cyan/15 text-sm font-black text-cyan">{index + 1}</span>
                  <h3 className="mt-7 text-xl font-black">{step.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-white/58">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
