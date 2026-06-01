import type { FeedbackSession, SessionDraft, TeamMember } from '../types/session';

export function createMemberId(name: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return slug || `member-${Date.now()}`;
}

export function createSessionPayload(draft: SessionDraft) {
  return {
    sessionName: draft.name.trim(),
    teamMembers: draft.members.map((member) => ({ id: member.id, name: member.name }))
  };
}

export function buildSessionUrl(origin: string, session: FeedbackSession) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  return `${appUrl || origin}${session.evaluationPath}`;
}

export function hasMember(members: TeamMember[], name: string) {
  return members.some((member) => member.name.toLowerCase() === name.toLowerCase());
}
