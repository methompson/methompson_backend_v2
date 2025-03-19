import { NextFunction, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { useAuth } from '@/modules/auth/init';
import { AuthModel, METBackendRequest } from '@/modules/auth/auth_model';

export async function verifyIdToken(idToken: string) {
  return await getAuth().verifyIdToken(idToken);
}

export async function authCheckMiddleware(
  req: METBackendRequest,
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
    const decoded = await verifyIdToken(idToken);

    const authModel = new AuthModel(idToken, decoded);

    req.authModel = authModel;

    next();
  } catch (_e) {
    res.sendStatus(401);
  }
}
