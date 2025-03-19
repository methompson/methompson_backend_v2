import { Response } from 'express';
import { isString } from 'tcheck';

import { METBackendRequest } from '@/modules/auth/auth_model';
import { deleteViceBankUser } from '@/modules/vice_bank/data_controller/user/user';

export async function deleteUserController(
  req: METBackendRequest,
  res: Response,
) {
  const userId = req.authModel?.userId;
  if (!userId) {
    res.status(401).json({
      error: 'Unauthorized',
    });
    return;
  }

  const { vbUserId } = req.body;

  if (!isString(vbUserId)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const user = await deleteViceBankUser(userId, vbUserId);

    res.json({ user });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
