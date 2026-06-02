'use client';

import { evaluationCriteria } from '../../data/evaluation';
import { useEvaluationSession } from '../../hooks/useEvaluationSession';
import { AppShell } from '../layout/AppShell';

type EvaluationClientProps = {
  sessionId: string;
};

const ratingScale = [1, 2, 3, 4];

export default function EvaluationClient({ sessionId }: EvaluationClientProps) {
  const { canSubmit, evaluatorId, ratings, router, session, setEvaluatorId, setRating, status, submitEvaluation, totals } = useEvaluationSession(sessionId);

  if (!session) {
    return (
      <AppShell>
        <main className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-xl place-items-center px-6 text-center">
          <div>
            <h1 className="text-3xl font-black">Session not found</h1>
            <p className="mt-3 text-sm font-semibold text-ink/54">Create a new session to generate a fresh evaluation link.</p>
            <button className="mt-6 rounded-full bg-violet px-6 py-3 text-sm font-black text-white" onClick={() => router.push('/sessions/new')} type="button">
              New Session
            </button>
          </div>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="px-1 py-0">
        <div className="flex items-center justify-between bg-white/55 px-1 py-2">
          <div>
            <h1 className="text-sm font-semibold">Peer Evaluation</h1>
            <p className="text-sm text-ink/80">Rate your team members based on their contributions.</p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <label className="text-xs font-black text-ink/60">
              Your name
              <select
                className="ml-2 h-10 rounded-md border border-ink/12 bg-white px-3 text-xs font-bold text-ink outline-none focus:border-cyan focus:ring-4 focus:ring-cyan/15"
                onChange={(event) => setEvaluatorId(event.target.value)}
                value={evaluatorId}
              >
                <option value="">Choose member</option>
                {session.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="rounded-sm bg-gradient-to-r from-violet to-cyan px-7 py-3 text-xs font-black text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!canSubmit}
              onClick={submitEvaluation}
              type="button"
            >
              Submit Evaluation
            </button>
            {status && <p className="basis-full text-right text-xs font-bold text-violet">{status}</p>}
          </div>
        </div>

        <section className="overflow-x-auto rounded-b-3xl border border-ink/6 bg-white shadow-soft">
          <table className="min-w-[980px] w-full border-collapse">
            <thead>
              <tr className="border-b border-ink/8 bg-white">
                <th className="w-[18rem] px-6 py-4 text-left text-sm font-black">Assessment Category</th>
                {session.members.map((member) => (
                  <th className="px-4 py-4 text-center text-sm font-black" key={member.id}>
                    {member.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {evaluationCriteria.map((criterion) => (
                <tr className="border-b border-ink/6" key={criterion.id}>
                  <td className="px-6 py-7 text-sm font-semibold leading-5 text-ink/72">{criterion.label}</td>
                  {session.members.map((member) => (
                    <td className="px-4 py-7 text-center" key={`${criterion.id}-${member.id}`}>
                      <div className="flex justify-center gap-3">
                        {ratingScale.map((rating) => {
                          const selected = ratings[member.id]?.[criterion.id] === rating;
                          return (
                            <button
                              aria-label={`${member.name} ${criterion.label} rating ${rating}`}
                              className={`grid size-8 place-items-center rounded-full text-sm font-black transition ${
                                selected ? 'bg-violet text-white shadow-[0_0_16px_rgba(125,63,242,0.55)]' : 'border border-ink/8 bg-white text-ink/52'
                              }`}
                              key={rating}
                              onClick={() => setRating(member.id, criterion.id, rating)}
                              type="button"
                            >
                              {rating}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-ink/4">
                <td className="px-6 py-6 text-sm font-black">Total scores</td>
                {totals.map((score) => (
                  <td className="px-4 py-6 text-center text-sm font-black" key={score.memberId}>
                    {score.total}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </AppShell>
  );
}
