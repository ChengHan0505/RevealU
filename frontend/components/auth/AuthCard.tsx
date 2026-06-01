'use client';

import { useAuthForm } from '../../hooks/useAuthForm';

type AuthCardProps = {
  initialMode?: 'login' | 'register';
};

export default function AuthCard({ initialMode = 'login' }: AuthCardProps) {
  const { form, handleSubmit, isLogin, remember, setRemember, status, switchMode, updateField } = useAuthForm(initialMode);

  return (
    <section className="glass-panel z-10 w-full max-w-[28rem] rounded-[1.7rem] px-7 py-8 sm:px-8">
      <div className="mb-8 grid rounded-full bg-ink/7 p-1.5 text-sm font-black text-ink/55">
        <div className="grid grid-cols-2 rounded-full">
          <button
            className={`rounded-full py-2.5 transition ${isLogin ? 'bg-white text-violet shadow-sm' : 'hover:text-ink'}`}
            onClick={() => switchMode('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={`rounded-full py-2.5 transition ${!isLogin ? 'bg-white text-violet shadow-sm' : 'hover:text-ink'}`}
            onClick={() => switchMode('register')}
            type="button"
          >
            Sign Up
          </button>
        </div>
      </div>

      <header>
        <h2 className="text-2xl font-black text-ink">{isLogin ? 'Welcome back' : 'Create account'}</h2>
        <p className="mt-1 text-sm font-semibold text-ink/48">
          {isLogin ? 'Ready to drop some knowledge?' : 'Start leveling up feedback today.'}
        </p>
      </header>

      <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
        {!isLogin && (
          <label className="block">
            <span className="sr-only">Full name</span>
            <span className="relative block">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/32">ID</span>
              <input
                className="h-12 w-full rounded-lg border border-ink/22 bg-white/75 pl-11 pr-4 text-sm font-semibold text-ink outline-none transition placeholder:text-ink/28 focus:border-cyan focus:ring-4 focus:ring-cyan/15"
                name="name"
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Full name"
                type="text"
                value={form.name}
              />
            </span>
          </label>
        )}

        <label className="block">
          <span className="sr-only">Email address</span>
          <span className="relative block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/32">@</span>
            <input
              autoComplete="email"
              className="h-12 w-full rounded-lg border border-ink/22 bg-white/75 pl-11 pr-4 text-sm font-semibold text-ink outline-none transition placeholder:text-ink/28 focus:border-cyan focus:ring-4 focus:ring-cyan/15"
              name="email"
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="Email address"
              required
              type="email"
              value={form.email}
            />
          </span>
        </label>

        <label className="block">
          <span className="sr-only">Password</span>
          <span className="relative block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/32">#</span>
            <input
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="h-12 w-full rounded-lg border border-ink/22 bg-white/75 pl-11 pr-4 text-sm font-semibold text-ink outline-none transition placeholder:text-ink/28 focus:border-cyan focus:ring-4 focus:ring-cyan/15"
              minLength={6}
              name="password"
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Password"
              required
              type="password"
              value={form.password}
            />
          </span>
        </label>

        <div className="flex items-center justify-between gap-4 pt-1 text-xs font-bold">
          <label className="flex items-center gap-2 text-ink/58">
            <input
              checked={remember}
              className="size-4 rounded border-ink/20 text-violet focus:ring-violet"
              name="remember"
              onChange={(event) => setRemember(event.target.checked)}
              type="checkbox"
            />
            Remember me
          </label>
          {isLogin && (
            <a className="text-cyan transition hover:text-violet" href="#forgot">
              Forgot password?
            </a>
          )}
        </div>

        <button
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet to-cyan text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(125,63,242,0.28)]"
          type="submit"
        >
          Enter Arena
          <span aria-hidden="true">-&gt;</span>
        </button>

        <div className="flex items-center gap-4 py-2">
          <span className="h-px flex-1 bg-ink/9" />
          <span className="text-[0.67rem] font-black uppercase tracking-[0.14em] text-ink/32">or continue with</span>
          <span className="h-px flex-1 bg-ink/9" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="h-12 rounded-lg border border-ink/8 bg-white/65 text-lg font-black shadow-sm transition hover:border-cyan/50" type="button">
            <span className="text-[#4285f4]">G</span>
          </button>
          <button className="h-12 rounded-lg border border-ink/8 bg-white/65 text-lg font-black shadow-sm transition hover:border-cyan/50" type="button">
            GH
          </button>
        </div>

        <p className="min-h-5 text-center text-xs font-bold text-ink/48" role="status">
          {status}
        </p>
      </form>
    </section>
  );
}
