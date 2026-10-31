import { Router } from 'express';
import { Activity } from '../models/activity.js';
import {
  badRequest,
  notFound,
  requiredString,
  validateBody,
} from './helpers.js';

const router = Router();

router.get('/', async (request, response) => {
  const filter = request.query.userId ? { user: request.query.userId } : {};
  const activities = await Activity.find(filter)
    .populate('user', 'fullName username')
    .sort({ completedAt: -1 });
  response.json(activities);
});

router.post('/', async (request, response) => {
  if (!validateBody(request, response)) return;

  const user = requiredString(request.body, 'userId');
  const activityType = requiredString(request.body, 'activityType');
  const durationMinutes = Number(request.body.durationMinutes);
  if (!user || !activityType || !Number.isFinite(durationMinutes)) {
    badRequest(response, 'userId, activityType, and durationMinutes are required');
    return;
  }

  const activity = await Activity.create({
    user,
    activityType,
    durationMinutes,
    ...(request.body.distanceKm !== undefined
      ? { distanceKm: Number(request.body.distanceKm) }
      : {}),
    ...(request.body.calories !== undefined
      ? { calories: Number(request.body.calories) }
      : {}),
    ...(request.body.completedAt !== undefined
      ? { completedAt: request.body.completedAt }
      : {}),
  });
  response.status(201).json(activity);
});

router.get('/:id', async (request, response) => {
  const activity = await Activity.findById(request.params.id).populate(
    'user',
    'fullName username',
  );
  if (!activity) {
    notFound(response, 'Activity');
    return;
  }
  response.json(activity);
});

export default router;
