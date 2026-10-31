import { Router } from 'express';
import { Workout } from '../models/workout.js';
import {
  badRequest,
  notFound,
  requiredString,
  validateBody,
} from './helpers.js';

const router = Router();

router.get('/', async (_request, response) => {
  const workouts = await Workout.find().sort({ difficulty: 1, title: 1 });
  response.json(workouts);
});

router.post('/', async (request, response) => {
  if (!validateBody(request, response)) return;

  const title = requiredString(request.body, 'title');
  const description = requiredString(request.body, 'description');
  const difficulty = requiredString(request.body, 'difficulty');
  const goal = requiredString(request.body, 'goal');
  const durationMinutes = Number(request.body.durationMinutes);
  if (
    !title ||
    !description ||
    !difficulty ||
    !goal ||
    !Number.isFinite(durationMinutes)
  ) {
    badRequest(
      response,
      'title, description, durationMinutes, difficulty, and goal are required',
    );
    return;
  }

  const workout = await Workout.create({
    title,
    description,
    durationMinutes,
    difficulty,
    goal,
  });
  response.status(201).json(workout);
});

router.get('/:id', async (request, response) => {
  const workout = await Workout.findById(request.params.id);
  if (!workout) {
    notFound(response, 'Workout');
    return;
  }
  response.json(workout);
});

export default router;
