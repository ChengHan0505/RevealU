'use client';

import type { FeedbackSession, SessionDraft, SessionResult } from '../types/session';

const sessionsKey = 'revealu.sessions';
const resultsKey = 'revealu.results';

function readCollection<T>(key: string): Record<string, T> {
  if (typeof window === 'undefined') {
    return {};
  }

  const raw = window.localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as Record<string, T>) : {};
}

function writeCollection<T>(key: string, collection: Record<string, T>) {
  window.localStorage.setItem(key, JSON.stringify(collection));
}

export function createSession(draft: SessionDraft): FeedbackSession {
  const id = `ninja-${Date.now().toString(36)}`;
  const session: FeedbackSession = {
    ...draft,
    id,
    createdAt: new Date().toISOString(),
    evaluationPath: `/sessions/${id}/evaluate`
  };

  const sessions = readCollection<FeedbackSession>(sessionsKey);
  writeCollection(sessionsKey, { ...sessions, [id]: session });
  return session;
}

export function saveSession(session: FeedbackSession) {
  const sessions = readCollection<FeedbackSession>(sessionsKey);
  writeCollection(sessionsKey, { ...sessions, [session.id]: session });
}

export function getSession(id: string) {
  return readCollection<FeedbackSession>(sessionsKey)[id] ?? null;
}

export function getRecentSessions() {
  return Object.values(readCollection<FeedbackSession>(sessionsKey)).sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  );
}

export function saveResult(result: SessionResult) {
  const results = readCollection<SessionResult>(resultsKey);
  writeCollection(resultsKey, { ...results, [result.sessionId]: result });
}

export function getResult(sessionId: string) {
  return readCollection<SessionResult>(resultsKey)[sessionId] ?? null;
}
