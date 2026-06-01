'use client';

import { useEffect, useMemo, useState } from 'react';
import { aggregateByScores, sortScoresDescending } from '../utils/scoring';
import { getResult, getSession, saveResult, saveSession } from '../utils/session-store';
import { getJson } from '../utils/api';
import type { FeedbackSession, SessionResult } from '../types/session';

export function useSessionResults(sessionId: string) {
  const [session, setSession] = useState<FeedbackSession | null>(null);
  const [result, setResult] = useState<SessionResult | null>(null);

  useEffect(() => {
    async function loadResult() {
      const storedSession = getSession(sessionId);
      const storedResult = getResult(sessionId);
      if (storedSession) {
        setSession(storedSession);
      }
      if (storedResult) {
        setResult(storedResult);
      }

      try {
        const sessionResponse = await getJson<{ session: FeedbackSession }>(`/api/sessions/${sessionId}`);
        saveSession(sessionResponse.session);
        setSession(sessionResponse.session);

        const resultResponse = await getJson<{ result: SessionResult }>(`/api/sessions/${sessionId}/result`);
        saveResult(resultResponse.result);
        setResult(resultResponse.result);
      } catch {
        return;
      }
    }

    loadResult();
    const intervalId = window.setInterval(loadResult, 2000);

    return () => window.clearInterval(intervalId);
  }, [sessionId]);

  const sortedScores = useMemo(() => sortScoresDescending(result?.scores ?? []), [result]);
  const aggregates = useMemo(() => {
    if (!session || !result) {
      return [];
    }
    return aggregateByScores(result.scores, result.submissionCount ?? 0, session.members.length);
  }, [result, session]);

  return { aggregates, result, session, sortedScores };
}
