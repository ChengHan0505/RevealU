'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSession, saveSession } from '../utils/session-store';
import { buildSessionUrl, createMemberId, createSessionPayload, hasMember } from '../utils/session-payload';
import { postJson } from '../utils/api';
import type { FeedbackSession, TeamMember } from '../types/session';

export function useSessionBuilder() {
  const router = useRouter();
  const [name, setName] = useState('Q3 Design Sync');
  const [memberName, setMemberName] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [session, setSession] = useState<FeedbackSession | null>(null);
  const [sessionUrl, setSessionUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const payload = useMemo(
    () => createSessionPayload({ name, members }),
    [members, name]
  );

  function addMember() {
    const trimmed = memberName.trim();
    if (!trimmed || hasMember(members, trimmed)) {
      return;
    }

    setMembers((current) => [...current, { id: createMemberId(trimmed), name: trimmed }]);
    setMemberName('');
    setSession(null);
    setSessionUrl('');
    setCopied(false);
  }

  async function generateSessionLink() {
    if (!payload.sessionName || payload.teamMembers.length === 0) {
      return null;
    }

    let nextSession: FeedbackSession;

    try {
      const response = await postJson('/api/sessions/create', payload) as { session: FeedbackSession };
      nextSession = response.session;
      saveSession(nextSession);
    } catch {
      nextSession = createSession({
        name: payload.sessionName,
        members: payload.teamMembers
      });
    }

    setSession(nextSession);
    setSessionUrl(buildSessionUrl(window.location.origin, nextSession));
    setCopied(false);

    return nextSession;
  }

  async function copyLink() {
    if (!sessionUrl) {
      return;
    }

    await navigator.clipboard.writeText(sessionUrl);
    setCopied(true);
  }

  async function createAndOpenEvaluation() {
    const nextSession = session ?? await generateSessionLink();
    if (nextSession) {
      router.push(nextSession.evaluationPath);
    }
  }

  return {
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
    setName
  };
}
