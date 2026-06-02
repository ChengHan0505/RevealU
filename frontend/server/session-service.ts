import { SessionModel } from './models/session';

type SessionDocument = {
  id: string;
  name: string;
  members: { id: string; name: string }[];
  evaluationPath: string;
  createdAt: Date;
  updatedAt: Date;
  submissions?: {
    evaluatorId: string;
    evaluatorName: string;
    ratings: Record<string, Record<string, number>>;
    scores: { memberId: string; name: string; total: number; max: number }[];
    submittedAt: Date;
  }[];
};

export function toClientSession(session: SessionDocument) {
  return {
    id: session.id,
    name: session.name,
    members: session.members,
    createdAt: session.createdAt.toISOString(),
    evaluationPath: session.evaluationPath
  };
}

export function buildResult(session: SessionDocument) {
  const submissions = session.submissions ?? [];
  const latest = submissions.at(-1);
  const totals = new Map<string, { memberId: string; name: string; total: number; max: number }>();

  for (const submission of submissions) {
    for (const score of submission.scores) {
      const current = totals.get(score.memberId) ?? {
        memberId: score.memberId,
        name: score.name,
        total: 0,
        max: 0
      };
      current.total += score.total;
      current.max += score.max;
      totals.set(score.memberId, current);
    }
  }

  const scores = session.members.map((member) => {
    const aggregate = totals.get(member.id);
    return {
      memberId: member.id,
      name: member.name,
      total: aggregate?.total ?? 0,
      max: aggregate?.max ?? 24
    };
  });

  return {
    sessionId: session.id,
    scores,
    ratings: latest?.ratings ?? {},
    evaluatorId: latest?.evaluatorId,
    evaluatorName: latest?.evaluatorName,
    submittedAt: latest?.submittedAt?.toISOString() ?? session.updatedAt.toISOString(),
    submissionCount: submissions.length
  };
}

export async function createSession(sessionName: string, teamMembers: { id: string; name: string }[]) {
  const id = `ninja-${crypto.randomUUID()}`;
  const seenNames = new Set<string>();
  const members = teamMembers.reduce<{ id: string; name: string }[]>((acc, member) => {
    const name = typeof member.name === 'string' ? member.name.trim() : '';
    const key = name.toLowerCase();

    if (!name || seenNames.has(key)) {
      return acc;
    }

    seenNames.add(key);
    return [...acc, { id: `member-${crypto.randomUUID()}`, name }];
  }, []);

  if (members.length === 0) {
    throw new Error('At least one valid team member is required.');
  }

  return SessionModel.create({
    id,
    name: sessionName.trim(),
    members,
    evaluationPath: `/sessions/${id}/evaluate`
  });
}

export async function findSession(id: string) {
  return SessionModel.findOne({ id }).lean<SessionDocument>();
}

export async function listSessions() {
  return SessionModel.find().sort({ createdAt: -1 }).limit(20).lean<SessionDocument[]>();
}

export async function submitEvaluation(
  id: string,
  payload: {
    evaluatorId: string;
    ratings: Record<string, Record<string, number>>;
    scores: { memberId: string; name: string; total: number; max: number }[];
    submittedAt?: string;
  }
) {
  const session = await findSession(id);

  if (!session) {
    return { status: 'not-found' as const, session: null };
  }

  const evaluator = session.members.find((member) => member.id === payload.evaluatorId);

  if (!evaluator) {
    return { status: 'invalid-evaluator' as const, session };
  }

  const scoreByMemberId = new Map(payload.scores.map((score) => [score.memberId, score]));
  const sanitizedScores = session.members.map((member) => {
    const score = scoreByMemberId.get(member.id);
    return {
      memberId: member.id,
      name: member.name,
      total: Number(score?.total ?? 0),
      max: Number(score?.max ?? 24)
    };
  });

  const updated = await SessionModel.findOneAndUpdate(
    { id, 'submissions.evaluatorId': { $ne: evaluator.id } },
    {
      $push: {
        submissions: {
          evaluatorId: evaluator.id,
          evaluatorName: evaluator.name,
          ratings: payload.ratings,
          scores: sanitizedScores,
          submittedAt: payload.submittedAt ? new Date(payload.submittedAt) : new Date()
        }
      }
    },
    { new: true }
  ).lean<SessionDocument>();

  if (!updated) {
    return { status: 'duplicate' as const, session };
  }

  return { status: 'submitted' as const, session: updated };
}
