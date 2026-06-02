import { Router } from 'express';
import crypto from 'node:crypto';
import { Session } from '../models/sessionModel.js';

export const sessionRouter = Router();

sessionRouter.get('/', async (_req, res, next) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ sessions: sessions.map(toClientSession) });
  } catch (error) {
    next(error);
  }
});

sessionRouter.post('/create', async (req, res, next) => {
  try {
    const { sessionName, teamMembers } = req.body;
    const name = typeof sessionName === 'string' ? sessionName.trim() : '';
    const submittedMembers = Array.isArray(teamMembers) ? teamMembers : [];

    if (!name || submittedMembers.length === 0) {
      res.status(400).json({ message: 'Session name and team members are required.' });
      return;
    }

    const id = `ninja-${crypto.randomUUID()}`;
    const seenNames = new Set();
    const members = submittedMembers.reduce((acc, member) => {
      const memberName = typeof member.name === 'string' ? member.name.trim() : '';
      const key = memberName.toLowerCase();

      if (!memberName || seenNames.has(key)) {
        return acc;
      }

      seenNames.add(key);
      return [...acc, { id: `member-${crypto.randomUUID()}`, name: memberName }];
    }, []);

    if (members.length === 0) {
      res.status(400).json({ message: 'At least one valid team member is required.' });
      return;
    }

    const session = await Session.create({
      id,
      name,
      members,
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
    const { evaluatorId, scores, ratings, submittedAt } = req.body;
    const existingSession = await Session.findOne({ id: req.params.id });

    if (!existingSession) {
      res.status(404).json({ message: 'Session not found.' });
      return;
    }

    const evaluator = existingSession.members.find((member) => member.id === evaluatorId);
    if (!evaluator) {
      res.status(400).json({ message: 'Choose a valid team member before submitting.' });
      return;
    }

    const scoreByMemberId = new Map(scores.map((score) => [score.memberId, score]));
    const sanitizedScores = existingSession.members.map((member) => {
      const score = scoreByMemberId.get(member.id);
      return {
        memberId: member.id,
        name: member.name,
        total: Number(score?.total ?? 0),
        max: Number(score?.max ?? 24)
      };
    });

    const session = await Session.findOneAndUpdate(
      { id: req.params.id, 'submissions.evaluatorId': { $ne: evaluator.id } },
      {
        $push: {
          submissions: {
            evaluatorId: evaluator.id,
            evaluatorName: evaluator.name,
            ratings,
            scores: sanitizedScores,
            submittedAt: submittedAt ? new Date(submittedAt) : new Date()
          }
        }
      },
      { new: true }
    );

    if (!session) {
      res.status(409).json({
        message: 'This team member has already submitted an evaluation.',
        result: buildResult(existingSession)
      });
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
    evaluatorId: latest?.evaluatorId,
    evaluatorName: latest?.evaluatorName,
    submittedAt: latest?.submittedAt?.toISOString() ?? session.updatedAt.toISOString(),
    submissionCount: submissions.length
  };
}
