import { Router } from 'express';
import { Leaderboard } from '../models/leaderboard.js';

const router = Router();

router.get('/', async (_request, response) => {
  const rankings = await Leaderboard.find()
    .populate('user', 'fullName username')
    .populate('team', 'name')
    .sort({ points: -1, updatedAt: 1 });
  response.json(rankings);
});

export default router;
