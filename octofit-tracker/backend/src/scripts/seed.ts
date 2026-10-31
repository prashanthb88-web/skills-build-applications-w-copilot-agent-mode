import mongoose from 'mongoose';
import { Activity } from '../models/activity.js';
import { Leaderboard } from '../models/leaderboard.js';
import { Team } from '../models/team.js';
import { User } from '../models/user.js';
import { Workout } from '../models/workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    const userSeeds = [
      { fullName: 'Alex Morgan', username: 'alexm', email: 'alex@example.com' },
      { fullName: 'Jordan Lee', username: 'jordanl', email: 'jordan@example.com' },
    ];
    const users = await Promise.all(
      userSeeds.map(async (seed) => {
        const existingUser = await User.findOne({ email: seed.email });
        return existingUser ?? User.create(seed);
      }),
    );

    let team = await Team.findOne({ name: 'Trailblazers' });
    if (!team) {
      team = await Team.create({
        name: 'Trailblazers',
        description: 'Build healthy habits together.',
        members: users.map((user) => user._id),
      });
    } else {
      team.members = users.map((user) => user._id);
      await team.save();
    }
    await User.updateMany(
      { _id: { $in: users.map((user) => user._id) } },
      { $set: { team: team._id } },
    );

    const activitySeeds = users.map((user, index) => ({
      user: user._id,
      activityType: index === 0 ? 'running' : 'cycling',
      durationMinutes: index === 0 ? 30 : 45,
      distanceKm: index === 0 ? 5 : 12,
      calories: index === 0 ? 300 : 420,
      completedAt: new Date(`2026-10-${29 + index}T09:00:00.000Z`),
    }));
    for (const seed of activitySeeds) {
      const existingActivity = await Activity.findOne({
        user: seed.user,
        completedAt: seed.completedAt,
      });
      if (!existingActivity) await Activity.create(seed);
    }

    for (const [index, user] of users.entries()) {
      const existingRanking = await Leaderboard.findOne({ user: user._id });
      if (!existingRanking) {
        await Leaderboard.create({
          user: user._id,
          team: team._id,
          points: 100 - index * 10,
        });
      } else {
        existingRanking.team = team._id;
        await existingRanking.save();
      }
    }

    const workoutSeeds = [
      {
        title: 'Starter Run',
        description: 'A steady run to build your endurance.',
        durationMinutes: 30,
        difficulty: 'beginner',
        goal: 'endurance',
      },
      {
        title: 'Bodyweight Strength',
        description: 'A full-body strength session with no equipment.',
        durationMinutes: 25,
        difficulty: 'intermediate',
        goal: 'strength',
      },
    ];
    for (const seed of workoutSeeds) {
      const existingWorkout = await Workout.findOne({ title: seed.title });
      if (!existingWorkout) await Workout.create(seed);
    }

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

await seedDatabase();
