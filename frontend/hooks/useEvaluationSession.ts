'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { evaluationCriteria } from '../data/evaluation';
import { calculateTotals } from '../utils/scoring';
import { getSession, saveResult, saveSession } from '../utils/session-store';
import { getJson, postJson } from '../utils/api';
import type { FeedbackSession, RatingsByMember, SessionResult } from '../types/session';

export function useEvaluationSession(sessionId: string) {
  const router = useRouter();
  const [session, setSession] = useState<FeedbackSession | null>(null);
  const [ratings, setRatings] = useState<RatingsByMember>({});

  useEffect(() => {
    async function loadSession() {
      const stored = getSession(sessionId);
      if (stored) {
        setSession(stored);
        return;
      }

      try {
        const response = await getJson<{ session: FeedbackSession }>(`/api/sessions/${sessionId}`);
        saveSession(response.session);
        setSession(response.session);
      } catch {
        setSession(null);
      }
    }

    loadSession();
  }, [sessionId]);

  const totals = useMemo(
    () => (session ? calculateTotals(session.members, evaluationCriteria, ratings) : []),
    [ratings, session]
  );

  function setRating(memberId: string, criterionId: string, value: number) {
    setRatings((current) => ({
      ...current,
      [memberId]: {
        ...current[memberId],
        [criterionId]: value
      }
    }));
  }

  async function submitEvaluation() {
    if (!session) {
      return;
    }

    const result: SessionResult = {
      sessionId,
      ratings,
      scores: totals,
      submittedAt: new Date().toISOString()
    };

    try {
      const response = await postJson(`/api/sessions/${sessionId}/submit`, result) as { result: SessionResult };
      saveResult(response.result);
    } catch {
      saveResult(result);
    }

    router.push(`/sessions/${sessionId}/results`);
  }

  return { ratings, router, session, setRating, submitEvaluation, totals };
}
