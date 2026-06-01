'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSessionResults } from '../../hooks/useSessionResults';
import { buildSessionUrl } from '../../utils/session-payload';
import { AppShell } from '../layout/AppShell';
import { SurfaceCard } from '../ui/SurfaceCard';

type ResultsClientProps = {
  sessionId: string;
};

const progressColors = ['from-violet to-cyan', 'from-violet to-fuchsia-300', 'from-orange-300 to-orange-200'];

export default function ResultsClient({ sessionId }: ResultsClientProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const { aggregates, result, session, sortedScores } = useSessionResults(sessionId);

  if (!session || !result) {
    return (
      <AppShell>
        <main className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-xl place-items-center px-6 text-center">
          <div>
            <h1 className="text-3xl font-black">Results are not ready</h1>
            <p className="mt-3 text-sm font-semibold text-ink/54">Submit an evaluation before opening the leaderboard.</p>
            <button
              className="mt-6 rounded-full bg-violet px-6 py-3 text-sm font-black text-white"
              onClick={() => router.push(`/sessions/${sessionId}/evaluate`)}
              type="button"
            >
              Back to Evaluation
            </button>
          </div>
        </main>
      </AppShell>
    );
  }

  const evaluationUrl = buildSessionUrl(window.location.origin, session);

  async function copyEvaluationLink() {
    if (!session) {
      return;
    }

    await navigator.clipboard.writeText(evaluationUrl);
    setShowLink(true);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <AppShell>
      <main className="relative mx-auto min-h-[calc(100vh-3.5rem)] max-w-6xl overflow-hidden px-6 py-12 sm:px-10">
        <Confetti />
        <header className="relative z-10 mb-9">
          <h1 className="text-5xl font-black tracking-normal text-violet">Session Complete!</h1>
          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <p className="max-w-xl text-sm font-semibold leading-6 text-ink/68">
              The results are in. Let&apos;s see how the team performed in this sprint&apos;s feedback gauntlet.
            </p>
            <div className="w-full max-w-md">
              <button
                className="h-11 w-full rounded-md border border-cyan/30 bg-white px-5 text-sm font-black text-cyan shadow-sm transition hover:bg-cyan hover:text-white"
                onClick={copyEvaluationLink}
                type="button"
              >
                {copied ? 'Copied' : 'Copy Evaluation Link'}
              </button>
              {showLink && (
                <a
                  aria-label="Open peer evaluation link"
                  className="mt-3 block cursor-pointer truncate rounded-md bg-white px-4 py-3 text-sm font-bold text-blue-500 shadow-sm underline-offset-4 transition hover:text-cyan hover:underline"
                  href={evaluationUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {evaluationUrl}
                </a>
              )}
            </div>
          </div>
        </header>

        <div className="relative z-10 grid gap-7 lg:grid-cols-[0.55fr_1fr]">
          <SurfaceCard className="min-h-[34rem] p-6">
            <div className="mb-6">
              <h2 className="text-xl font-black">Top Contributors</h2>
              <p className="mt-1 text-xs font-bold text-ink/45">
                Cumulative marks from {result.submissionCount ?? 0} submitted evaluation{(result.submissionCount ?? 0) === 1 ? '' : 's'}.
              </p>
            </div>
            <div className="space-y-4">
              {sortedScores.map((score, index) => (
                <article
                  className={`flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm ${
                    index === 0 ? 'border-violet/30 ring-2 ring-violet/10' : 'border-ink/7'
                  }`}
                  key={score.memberId}
                >
                  <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-violet/30 to-cyan/30 text-sm font-black">
                    {score.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black">{score.name}</p>
                    {index < 2 && (
                      <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[0.62rem] font-black ${index === 0 ? 'bg-orange-100 text-orange-500' : 'bg-cyan/15 text-cyan'}`}>
                        {index === 0 ? 'MVP' : 'Insightful'}
                      </span>
                    )}
                  </div>
                  <p className={`text-2xl font-black ${index === 0 ? 'text-violet' : 'text-ink/58'}`}>
                    {score.total}<span className="text-sm text-ink/38">/{score.max}</span>
                  </p>
                </article>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="h-fit p-8">
            <h2 className="mb-7 text-2xl font-black">Aggregate Performance</h2>
            <div className="space-y-7">
              {aggregates.map((item, index) => (
                <div key={item.label}>
                  <div className="mb-3 flex items-center justify-between text-sm font-black">
                    <span className="text-ink/64">{item.label}</span>
                    <span className={index === 2 ? 'text-orange-400' : index === 1 ? 'text-violet' : 'text-cyan'}>
                      {item.percent}% <span className="text-ink/42">({item.detail})</span>
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-ink/8">
                    <span
                      className={`block h-full rounded-full bg-gradient-to-r ${progressColors[index]}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </main>
    </AppShell>
  );
}

function Confetti() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {Array.from({ length: 28 }).map((_, index) => (
        <span
          className="absolute h-3 w-1 rounded-full bg-cyan"
          key={index}
          style={{
            left: `${(index * 17) % 100}%`,
            top: `${(index * 23) % 92}%`,
            transform: `rotate(${index * 29}deg)`,
            opacity: index % 3 === 0 ? 0.45 : 0.85,
            backgroundColor: index % 4 === 0 ? '#7d3ff2' : index % 5 === 0 ? '#ffb173' : '#10bfd0'
          }}
        />
      ))}
    </div>
  );
}
