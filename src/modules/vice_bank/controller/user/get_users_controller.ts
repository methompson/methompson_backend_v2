import { Response } from 'express';

import { METBackendRequest } from '@/modules/auth/auth_model';
import { getViceBankUsers } from '@/modules/vice_bank/data_controller/user/user';

export async function getUsersController(
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

  try {
    const users = await getViceBankUsers(userId);

    res.json({ users });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
