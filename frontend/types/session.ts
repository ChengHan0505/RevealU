export type TeamMember = {
  id: string;
  name: string;
};

export type SessionDraft = {
  name: string;
  members: TeamMember[];
};

export type FeedbackSession = SessionDraft & {
  id: string;
  createdAt: string;
  evaluationPath: string;
};

export type EvaluationCriterion = {
  id: string;
  label: string;
  category: 'Communication' | 'Innovation' | 'Teamwork';
};

export type RatingsByMember = Record<string, Record<string, number>>;

export type MemberScore = {
  memberId: string;
  name: string;
  total: number;
  max: number;
};

export type SessionResult = {
  sessionId: string;
  scores: MemberScore[];
  ratings: RatingsByMember;
  submittedAt: string;
  submissionCount?: number;
};

export type AggregateMetric = {
  label: string;
  percent: number;
  detail: string;
};
