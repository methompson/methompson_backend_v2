import { NextFunction, Request, Response } from 'express';
import { useAuth } from './init';
import { getAuth } from 'firebase-admin/auth';

export async function verifyIdToken(idToken: string) {
  return await getAuth().verifyIdToken(idToken);
}

export async function authCheckMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!useAuth()) {
    next();
    return;
  }

  const idToken = req.headers.authorization ?? req.cookies?.idToken;

  if (!idToken) {
    res.sendStatus(401);
    return;
  }

  try {
    await verifyIdToken(idToken);
    next();
  } catch (_e) {
    res.sendStatus(401);
  }
}
