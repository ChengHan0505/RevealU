import type { AggregateMetric, EvaluationCriterion, MemberScore, RatingsByMember, TeamMember } from '../types/session';

export const maxRating = 4;

export function calculateTotals(
  members: TeamMember[],
  criteria: EvaluationCriterion[],
  ratings: RatingsByMember
): MemberScore[] {
  const max = criteria.length * maxRating;

  return members.map((member) => ({
    memberId: member.id,
    name: member.name,
    total: criteria.reduce((sum, criterion) => sum + (ratings[member.id]?.[criterion.id] ?? 0), 0),
    max
  }));
}

export function sortScoresDescending(scores: MemberScore[]) {
  return [...scores].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
}

export function aggregateByCategory(
  criteria: EvaluationCriterion[],
  ratings: RatingsByMember
) {
  const grouped = criteria.reduce<Record<string, { total: number; count: number }>>((acc, criterion) => {
    Object.values(ratings).forEach((memberRatings) => {
      const value = memberRatings[criterion.id];
      if (!value) {
        return;
      }
      const bucket = acc[criterion.category] ?? { total: 0, count: 0 };
      acc[criterion.category] = {
        total: bucket.total + value,
        count: bucket.count + 1
      };
    });
    return acc;
  }, {});

  return ['Communication', 'Innovation', 'Teamwork'].map((label) => {
    const bucket = grouped[label] ?? { total: 0, count: 1 };
    return {
      label,
      percent: Math.round((bucket.total / (bucket.count * maxRating)) * 100)
    };
  });
}

export function aggregateByScores(scores: MemberScore[], submissionCount = 0, memberCount = scores.length): AggregateMetric[] {
  const totalMarks = scores.reduce((sum, score) => sum + score.total, 0);
  const maxMarks = scores.reduce((sum, score) => sum + score.max, 0);
  const averageMarks = scores.length ? Math.round(totalMarks / scores.length) : 0;
  const averageMax = scores.length ? Math.round(maxMarks / scores.length) : 0;
  const completionPercent = memberCount ? Math.min(100, Math.round((submissionCount / memberCount) * 100)) : 0;

  return [
    {
      label: 'Overall Team Marks',
      percent: maxMarks ? Math.round((totalMarks / maxMarks) * 100) : 0,
      detail: `${totalMarks}/${maxMarks}`
    },
    {
      label: 'Average Member Score',
      percent: averageMax ? Math.round((averageMarks / averageMax) * 100) : 0,
      detail: `${averageMarks}/${averageMax}`
    },
    {
      label: 'Feedback Submitted',
      percent: completionPercent,
      detail: `${submissionCount}/${memberCount}`
    }
  ];
}
