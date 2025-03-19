import { Request, Response } from 'express';

import { ViceBankUser } from '@vice_bank/models/vice_bank_user';
import { updateViceBankUser } from '@/modules/vice_bank/data_controller/user/user';

export async function updateUserController(req: Request, res: Response) {
  const { vbUser } = req.body;

  let update: ViceBankUser;

  try {
    update = ViceBankUser.fromJSON(vbUser);
  } catch (_e) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const result = await updateViceBankUser(update);

    res.json({ user: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
