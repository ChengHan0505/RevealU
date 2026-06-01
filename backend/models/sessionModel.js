import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  { _id: false }
);

const memberScoreSchema = new mongoose.Schema(
  {
    memberId: { type: String, required: true },
    name: { type: String, required: true },
    total: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    ratings: { type: mongoose.Schema.Types.Mixed, required: true },
    scores: { type: [memberScoreSchema], required: true },
    submittedAt: { type: Date, required: true }
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    members: { type: [teamMemberSchema], required: true },
    evaluationPath: { type: String, required: true },
    submissions: { type: [submissionSchema], default: [] }
  },
  { timestamps: true }
);

export const Session = mongoose.model('Session', sessionSchema);
