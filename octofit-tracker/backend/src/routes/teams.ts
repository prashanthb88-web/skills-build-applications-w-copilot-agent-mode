import { Router } from 'express';
import mongoose from 'mongoose';
import { Team } from '../models/team.js';
import { User } from '../models/user.js';
import {
  badRequest,
  notFound,
  requiredString,
  validateBody,
} from './helpers.js';

const router = Router();

router.get('/', async (_request, response) => {
  const teams = await Team.find().populate('members', 'fullName username');
  response.json(teams);
});

router.post('/', async (request, response) => {
  if (!validateBody(request, response)) return;

  const name = requiredString(request.body, 'name');
  if (!name) {
    badRequest(response, 'name is required');
    return;
  }

  const team = await Team.create({
    name,
    description: requiredString(request.body, 'description') ?? '',
  });
  response.status(201).json(team);
});

router.get('/:id', async (request, response) => {
  const team = await Team.findById(request.params.id).populate(
    'members',
    'fullName username',
  );
  if (!team) {
    notFound(response, 'Team');
    return;
  }
  response.json(team);
});

router.patch('/:id/members', async (request, response) => {
  if (!validateBody(request, response)) return;

  const userId = requiredString(request.body, 'userId');
  const action = request.body.action;
  if (
    !userId ||
    !mongoose.isValidObjectId(userId) ||
    (action !== 'add' && action !== 'remove')
  ) {
    badRequest(response, 'A valid userId and an add or remove action are required');
    return;
  }

  const [team, user] = await Promise.all([
    Team.findById(request.params.id),
    User.findById(userId),
  ]);
  if (!team) {
    notFound(response, 'Team');
    return;
  }
  if (!user) {
    notFound(response, 'User');
    return;
  }

  if (action === 'add') {
    if (user.team && !user.team.equals(team._id)) {
      badRequest(response, 'User already belongs to another team');
      return;
    }
    if (!team.members.some((member) => member.equals(user._id))) {
      team.members.push(user._id);
    }
    user.team = team._id;
  } else {
    team.members = team.members.filter((member) => !member.equals(user._id));
    if (user.team?.equals(team._id)) user.team = undefined;
  }

  await Promise.all([team.save(), user.save()]);
  response.json(await team.populate('members', 'fullName username'));
});

export default router;
