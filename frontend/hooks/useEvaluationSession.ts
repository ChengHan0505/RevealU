'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { evaluationCriteria } from '../data/evaluation';
import { calculateTotals } from '../utils/scoring';
import { getSession, saveResult, saveSession } from '../utils/session-store';
import { ApiError, getJson, postJson } from '../utils/api';
import type { FeedbackSession, RatingsByMember, SessionResult } from '../types/session';

export function useEvaluationSession(sessionId: string) {
  const router = useRouter();
  const [session, setSession] = useState<FeedbackSession | null>(null);
  const [evaluatorId, setEvaluatorId] = useState('');
  const [ratings, setRatings] = useState<RatingsByMember>({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function loadSession() {
      const stored = getSession(sessionId);
      if (stored) {
        setSession(stored);
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
    if (!session || !evaluatorId) {
      setStatus('Choose your name before submitting.');
      return;
    }

    const evaluator = session.members.find((member) => member.id === evaluatorId);
    if (!evaluator) {
      setStatus('Choose a valid team member before submitting.');
      return;
    }

    const result: SessionResult = {
      sessionId,
      evaluatorId: evaluator.id,
      evaluatorName: evaluator.name,
      ratings,
      scores: totals,
      submittedAt: new Date().toISOString()
    };

    try {
      const response = await postJson(`/api/sessions/${sessionId}/submit`, result) as { result: SessionResult };
      saveResult(response.result);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        const duplicateResponse = error.body as { result?: SessionResult };
        if (duplicateResponse.result) {
          saveResult(duplicateResponse.result);
          router.push(`/sessions/${sessionId}/results`);
          return;
        }
      }

      if (error instanceof ApiError) {
        const body = error.body as { message?: string };
        setStatus(body.message ?? 'Submission failed. Please try again.');
        return;
      }

      setStatus('Submission failed. Please try again.');
      return;
    }

    router.push(`/sessions/${sessionId}/results`);
  }

  const canSubmit = Boolean(evaluatorId);

  return {
    canSubmit,
    evaluatorId,
    ratings,
    router,
    session,
    setEvaluatorId,
    setRating,
    status,
    submitEvaluation,
    totals
  };
}
