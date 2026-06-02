'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '../layout/AppShell';
import { SurfaceCard } from '../ui/SurfaceCard';
import { getRecentSessions, saveSession } from '../../utils/session-store';
import { getJson } from '../../utils/api';
import type { FeedbackSession } from '../../types/session';

export default function DashboardClient() {
  const [sessions, setSessions] = useState<FeedbackSession[]>([]);

  useEffect(() => {
    setSessions(getRecentSessions());

    async function loadSessions() {
      try {
        const response = await getJson<{ sessions: FeedbackSession[] }>('/api/sessions');
        response.sessions.forEach(saveSession);
        setSessions(response.sessions);
      } catch {
        return;
      }
    }

    loadSessions();
  }, []);

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <header>
            <h1 className="text-6xl font-black tracking-normal text-ink">Welcome back.</h1>
            <p className="mt-3 text-sm font-semibold text-ink/58">Ready to decode your next feedback session?</p>
          </header>
          <Link
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet to-cyan px-7 text-sm font-black text-white shadow-glow transition hover:-translate-y-0.5"
            href="/sessions/new"
          >
            <span className="grid size-5 place-items-center rounded-full border border-white/70">+</span>
            Create New Session
          </Link>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1fr_0.48fr]">
          <SurfaceCard className="p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black">Active Sessions</h2>
              <span className="rounded-full bg-violet/12 px-3 py-1 text-xs font-black text-violet">{sessions.length} Live</span>
            </div>
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-ink/12 bg-white px-5 py-8 text-sm font-bold text-ink/45">
                  No active sessions yet. Create a new session to start collecting feedback.
                </div>
              ) : (
                sessions.map((session) => (
                  <article className="rounded-xl border border-ink/8 bg-white px-5 py-4 shadow-sm" key={session.id}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black">{session.name}</h3>
                        <p className="mt-1 text-xs font-semibold text-ink/50">{session.members.length} members</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-28 text-right">
                          <p className="mb-2 text-xs font-semibold text-ink/54">Ready to check</p>
                          <div className="h-2 rounded-full bg-ink/8">
                            <span className="block h-full w-[70%] rounded-full bg-cyan" />
                          </div>
                        </div>
                        <Link
                          className="grid h-10 min-w-16 place-items-center rounded-full bg-gradient-to-r from-violet to-cyan px-4 text-xs font-black text-white shadow-glow transition hover:-translate-y-0.5"
                          href={`/sessions/${session.id}/results`}
                        >
                          Check
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-8">
            <h2 className="mb-6 text-2xl font-black">Trophy Room</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Team MVP', 'Best Communicator'].map((label) => (
                <div className="grid min-h-28 place-items-center rounded-xl border border-ink/8 bg-white text-center" key={label}>
                  <span className="grid size-12 place-items-center rounded-full bg-cyan/12 text-xs font-black text-cyan">MVP</span>
                  <p className="text-xs font-bold text-ink/62">{label}</p>
                </div>
              ))}
              <div className="col-span-2 grid min-h-24 place-items-center rounded-xl border border-ink/8 bg-ink/5 text-center text-xs font-bold text-ink/34">
                Unlock Level 15
              </div>
            </div>
            <a className="mt-6 block text-center text-sm font-black text-violet" href="#insights">
              View All Achievements &gt;
            </a>
          </SurfaceCard>
        </div>

        <SurfaceCard className="mt-8 p-8" id="insights">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black">Past Results Insights</h2>
            <button className="rounded-md border border-ink/10 bg-white px-4 py-2 text-xs font-bold text-ink/60" type="button">
              Filter
            </button>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <Insight title="Overall Sentiment" value="8.4" detail="+0.5" />
            <Insight title="Sessions Completed" value={String(Math.max(0, sessions.length))} detail="This quarter" />
            <article className="rounded-xl border border-ink/8 bg-white p-5">
              <p className="text-sm font-semibold italic text-ink/72">"Great leadership in the last sprint, kept everyone focused."</p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-full bg-violet/12 px-3 py-1 text-xs font-bold text-violet">Leadership</span>
                <span className="rounded-full bg-cyan/12 px-3 py-1 text-xs font-bold text-cyan">Focus</span>
              </div>
            </article>
          </div>
        </SurfaceCard>
      </main>
    </AppShell>
  );
}

function Insight({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <article className="rounded-xl border border-ink/8 bg-white p-5">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-ink/42">{title}</p>
      <p className="mt-4 text-sm font-black text-ink">
        {value} <span className="ml-2 text-cyan">{detail}</span>
      </p>
    </article>
  );
}
