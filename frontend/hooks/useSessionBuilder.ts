'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSession } from '../utils/session-store';
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
  const [status, setStatus] = useState('');

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
    setStatus('');
  }

  async function generateSessionLink() {
    if (!payload.sessionName || payload.teamMembers.length === 0) {
      setStatus('Add a session name and at least one teammate.');
      return null;
    }

    try {
      const response = await postJson('/api/sessions/create', payload) as { session: FeedbackSession };
      const nextSession = response.session;
      saveSession(nextSession);

      setSession(nextSession);
      setSessionUrl(buildSessionUrl(window.location.origin, nextSession));
      setCopied(false);
      setStatus('');

      return nextSession;
    } catch {
      setSession(null);
      setSessionUrl('');
      setCopied(false);
      setStatus('Session link could not be created. Check MongoDB/API connection and try again.');
      return null;
    }
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
    setName,
    status
  };
}
