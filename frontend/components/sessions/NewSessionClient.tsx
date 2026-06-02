'use client';

import { useSessionBuilder } from '../../hooks/useSessionBuilder';
import { AppShell } from '../layout/AppShell';
import { SurfaceCard } from '../ui/SurfaceCard';

export default function NewSessionClient() {
  const {
    addMember,
    copied,
    copyLink,
    createAndOpenEvaluation,
    generateSessionLink,
    memberName,
    members,
    name,
    sessionUrl,
    setMemberName,
    setName,
    status
  } = useSessionBuilder();

  const canCreate = name.trim().length > 0 && members.length > 0;

  return (
    <AppShell footer>
      <main className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-5xl items-center px-6 py-12">
        <section className="w-full rounded-3xl border border-white/80 bg-white/74 px-9 py-12 shadow-soft backdrop-blur sm:px-16">
          <header className="mb-8">
            <h1 className="bg-gradient-to-r from-violet to-cyan bg-clip-text text-5xl font-black tracking-normal text-transparent">
              Start a New Feedback Ritual
            </h1>
            <p className="mt-4 max-w-xl text-sm font-bold leading-6 text-ink/48">
              Prepare the canvas. Add your teammates, generate a private link, then begin the evaluation.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr]">
            <div className="space-y-8">
              <SurfaceCard className="p-6">
                <h2 className="mb-5 text-lg font-black">Session Parameters</h2>
                <label className="block text-xs font-black text-ink/50">
                  Ritual Name
                  <input
                    className="mt-2 h-10 w-full rounded-md border border-ink/22 bg-white px-3 text-sm font-semibold outline-none focus:border-cyan focus:ring-4 focus:ring-cyan/15"
                    name="sessionName"
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g., Q3 Design Sync"
                    value={name}
                  />
                </label>
              </SurfaceCard>

              <SurfaceCard className="p-6">
                <h2 className="mb-5 text-lg font-black">Team Assembly</h2>
                <div className="flex gap-2">
                  <input
                    className="h-10 flex-1 rounded-md border border-ink/22 bg-white px-3 text-sm font-semibold outline-none focus:border-cyan focus:ring-4 focus:ring-cyan/15"
                    name="memberName"
                    onChange={(event) => setMemberName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addMember();
                      }
                    }}
                    placeholder="Add a teammate name..."
                    value={memberName}
                  />
                  <button className="grid h-10 w-12 place-items-center rounded-md bg-ink text-lg font-black text-cyan" onClick={addMember} type="button">
                    +
                  </button>
                </div>
                <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-ink/38">Team Members ({members.length})</p>
                <div className="mt-3 space-y-2">
                  {members.length === 0 ? (
                    <p className="rounded-lg bg-ink/5 px-3 py-3 text-sm font-bold text-ink/42">No teammates added yet.</p>
                  ) : (
                    members.map((member) => (
                      <div className="flex items-center gap-3 rounded-lg bg-ink/5 px-3 py-2 text-sm font-bold text-ink/68" key={member.id}>
                        <span className="grid size-7 place-items-center rounded-full bg-cyan/20 text-[0.65rem] text-cyan">{member.name.slice(0, 2).toUpperCase()}</span>
                        {member.name}
                      </div>
                    ))
                  )}
                </div>
              </SurfaceCard>
            </div>

            <aside className="flex flex-col gap-8">
              <SurfaceCard className="p-8 text-center">
                <div className="mx-auto mb-4 size-14 rounded-full border-4 border-cyan border-t-violet" />
                <p className="text-sm font-black text-violet">System Ready</p>
                <div className="mt-4 h-2 rounded-full bg-gradient-to-r from-cyan to-violet" />
              </SurfaceCard>

              <SurfaceCard className="mt-auto p-6">
                <h3 className="text-lg font-black text-cyan">Link Generated</h3>
                {sessionUrl ? (
                  <a
                    aria-label="Open generated peer evaluation link"
                    className="mt-4 block cursor-pointer truncate rounded-md bg-white px-4 py-4 text-sm font-bold text-blue-500 underline-offset-4 transition hover:text-cyan hover:underline"
                    href={sessionUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {sessionUrl}
                  </a>
                ) : (
                  <p className="mt-4 truncate rounded-md bg-white px-4 py-4 text-sm font-bold text-ink/82">
                    Generate a link to begin
                  </p>
                )}
                <button
                  className="mt-4 h-14 w-full rounded-xl bg-gradient-to-r from-violet to-cyan px-6 text-lg font-black text-white shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={!canCreate}
                  onClick={generateSessionLink}
                  type="button"
                >
                  Generate Session Link
                </button>
                {status && <p className="mt-3 text-center text-xs font-bold text-violet">{status}</p>}
                <button
                  className="mt-4 h-12 w-full rounded-md border border-cyan/30 bg-white text-sm font-black text-cyan transition hover:bg-cyan hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={!sessionUrl}
                  onClick={copyLink}
                  type="button"
                >
                  {copied ? 'Copied' : 'Copy Link'}
                </button>
                <a
                  className={`mt-4 flex h-12 w-full items-center justify-center rounded-md border border-violet/30 bg-white text-sm font-black text-violet transition hover:bg-violet hover:text-white ${
                    sessionUrl ? '' : 'pointer-events-none opacity-45'
                  }`}
                  href={sessionUrl || '#'}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open Link
                </a>
                <button
                  className="mt-4 h-12 w-full rounded-md bg-ink text-sm font-black text-white transition hover:bg-violet disabled:cursor-not-allowed disabled:opacity-45"
                  disabled={!canCreate}
                  onClick={createAndOpenEvaluation}
                  type="button"
                >
                  Create
                </button>
              </SurfaceCard>
            </aside>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
