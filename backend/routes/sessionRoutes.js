import { Router } from 'express';
import { Session } from '../models/sessionModel.js';

export const sessionRouter = Router();

sessionRouter.post('/create', async (req, res, next) => {
  try {
    const { sessionName, teamMembers } = req.body;
    const id = `ninja-${Date.now().toString(36)}`;
    const session = await Session.create({
      id,
      name: sessionName,
      members: teamMembers,
      evaluationPath: `/sessions/${id}/evaluate`
    });

    res.status(201).json({
      message: 'Session created.',
      session: toClientSession(session)
    });
  } catch (error) {
    next(error);
  }
});

sessionRouter.get('/:id', async (req, res, next) => {
  try {
    const session = await Session.findOne({ id: req.params.id });
    if (!session) {
      res.status(404).json({ message: 'Session not found.' });
      return;
    }

    res.status(200).json({ session: toClientSession(session) });
  } catch (error) {
    next(error);
  }
});

sessionRouter.get('/:id/result', async (req, res, next) => {
  try {
    const session = await Session.findOne({ id: req.params.id });
    if (!session) {
      res.status(404).json({ message: 'Session not found.' });
      return;
    }

    res.status(200).json({ result: buildResult(session) });
  } catch (error) {
    next(error);
  }
});

sessionRouter.post('/:id/submit', async (req, res, next) => {
  try {
    const { scores, ratings, submittedAt } = req.body;
    const session = await Session.findOneAndUpdate(
      { id: req.params.id },
      {
        $push: {
          submissions: {
            ratings,
            scores,
            submittedAt: submittedAt ? new Date(submittedAt) : new Date()
          }
        }
      },
      { new: true }
    );

    if (!session) {
      res.status(404).json({ message: 'Session not found.' });
      return;
    }

    res.status(200).json({
      message: 'Evaluation submitted.',
      result: buildResult(session)
    });
  } catch (error) {
    next(error);
  }
});

function toClientSession(session) {
  return {
    id: session.id,
    name: session.name,
    members: session.members,
    createdAt: session.createdAt.toISOString(),
    evaluationPath: session.evaluationPath
  };
}

function buildResult(session) {
  const submissions = session.submissions ?? [];
  const latest = submissions.at(-1);
  const totals = new Map();

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
