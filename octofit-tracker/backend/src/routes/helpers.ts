import type { Request, Response } from 'express';

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function requiredString(
  body: Record<string, unknown>,
  field: string,
): string | undefined {
  const value = body[field];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function badRequest(response: Response, message: string): void {
  response.status(400).json({ error: message });
}

export function notFound(response: Response, resource: string): void {
  response.status(404).json({ error: `${resource} not found` });
}

export function validateBody(
  request: Request,
  response: Response,
): request is Request & { body: Record<string, unknown> } {
  if (!isRecord(request.body)) {
    badRequest(response, 'Request body must be a JSON object');
    return false;
  }
  return true;
}
