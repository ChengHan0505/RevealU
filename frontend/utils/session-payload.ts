import type { FeedbackSession, SessionDraft, TeamMember } from '../types/session';

export function createMemberId(name: string) {
  const fallback = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `member-${globalThis.crypto?.randomUUID?.() ?? fallback}`;
}

export function createSessionPayload(draft: SessionDraft) {
  return {
    sessionName: draft.name.trim(),
    teamMembers: draft.members.map((member) => ({ id: member.id, name: member.name }))
  };
}

export function buildSessionUrl(origin: string, session: FeedbackSession) {
  const appUrl = resolveAppBaseUrl(origin);
  return `${appUrl}${session.evaluationPath}`;
}

function resolveAppBaseUrl(origin: string) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');

  if (!configuredUrl || configuredUrl.includes('your-vercel-app')) {
    return origin;
  }

  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return origin;
  }

  return configuredUrl;
}

export function hasMember(members: TeamMember[], name: string) {
  return members.some((member) => member.name.toLowerCase() === name.toLowerCase());
}
