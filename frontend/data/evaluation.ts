import type { EvaluationCriterion } from '../types/session';

export const evaluationCriteria: EvaluationCriterion[] = [
  {
    id: 'attendance',
    label: 'Attends team meetings regularly and arrives on time.',
    category: 'Communication'
  },
  {
    id: 'discussion',
    label: 'Contributes meaningfully to team discussions.',
    category: 'Communication'
  },
  {
    id: 'deadlines',
    label: 'Completes team assignments on time.',
    category: 'Teamwork'
  },
  {
    id: 'quality',
    label: 'Prepares work in a quality manner.',
    category: 'Innovation'
  },
  {
    id: 'cooperation',
    label: 'Demonstrates a cooperative and supportive attitude.',
    category: 'Teamwork'
  },
  {
    id: 'success',
    label: 'Contributes significantly to the success of the project.',
    category: 'Innovation'
  }
];
