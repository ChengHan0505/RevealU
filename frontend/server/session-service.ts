import { SessionModel } from './models/session';

type SessionDocument = {
  id: string;
  name: string;
  members: { id: string; name: string }[];
  evaluationPath: string;
  createdAt: Date;
  updatedAt: Date;
  submissions?: {
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
    submittedAt: latest?.submittedAt?.toISOString() ?? session.updatedAt.toISOString(),
    submissionCount: submissions.length
  };
}

export async function createSession(sessionName: string, teamMembers: { id: string; name: string }[]) {
  const id = `ninja-${Date.now().toString(36)}`;
  return SessionModel.create({
    id,
    name: sessionName,
    members: teamMembers,
    evaluationPath: `/sessions/${id}/evaluate`
  });
}

export async function findSession(id: string) {
  return SessionModel.findOne({ id }).lean<SessionDocument>();
}

export async function submitEvaluation(
  id: string,
  payload: {
    ratings: Record<string, Record<string, number>>;
    scores: { memberId: string; name: string; total: number; max: number }[];
    submittedAt?: string;
  }
) {
  return SessionModel.findOneAndUpdate(
    { id },
    {
      $push: {
        submissions: {
          ratings: payload.ratings,
          scores: payload.scores,
          submittedAt: payload.submittedAt ? new Date(payload.submittedAt) : new Date()
        }
      }
    },
    { new: true }
  ).lean<SessionDocument>();
}
