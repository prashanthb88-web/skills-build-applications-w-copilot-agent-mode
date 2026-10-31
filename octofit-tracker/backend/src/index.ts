import { connectDatabase, disconnectDatabase } from './config/database.js';
import { startServer } from './server.js';

try {
  await connectDatabase();
  startServer();
} catch (error) {
  console.error('Unable to start the OctoFit API:', error);
  await disconnectDatabase();
  process.exitCode = 1;
}