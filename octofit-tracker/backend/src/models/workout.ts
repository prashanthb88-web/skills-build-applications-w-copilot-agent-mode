import { model, Schema } from 'mongoose';

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    difficulty: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    goal: {
      type: String,
      required: true,
      enum: ['endurance', 'strength', 'flexibility', 'general'],
    },
  },
  { timestamps: true },
);

export const Workout = model('Workout', workoutSchema);
