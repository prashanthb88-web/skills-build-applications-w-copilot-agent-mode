import { Router } from 'express';
import { User } from '../models/user.js';
import {
  badRequest,
  notFound,
  requiredString,
  validateBody,
} from './helpers.js';

const router = Router();

router.get('/', async (_request, response) => {
  const users = await User.find().populate('team', 'name').sort({ fullName: 1 });
  response.json(users);
});

router.post('/', async (request, response) => {
  if (!validateBody(request, response)) return;

  const fullName = requiredString(request.body, 'fullName');
  const username = requiredString(request.body, 'username');
  const email = requiredString(request.body, 'email');
  if (!fullName || !username || !email) {
    badRequest(response, 'fullName, username, and email are required');
    return;
  }

  const user = await User.create({
    fullName,
    username,
    email,
  });
  response.status(201).json(user);
});

router.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('team', 'name');
  if (!user) {
    notFound(response, 'User');
    return;
  }
  response.json(user);
});

router.patch('/:id', async (request, response) => {
  if (!validateBody(request, response)) return;

  const updates: Record<string, unknown> = {};
  for (const field of ['fullName', 'username', 'email']) {
    if (field in request.body) updates[field] = request.body[field];
  }
  if (Object.keys(updates).length === 0) {
    badRequest(response, 'Provide at least one profile field to update');
    return;
  }

  const user = await User.findByIdAndUpdate(request.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate('team', 'name');
  if (!user) {
    notFound(response, 'User');
    return;
  }
  response.json(user);
});

export default router;
