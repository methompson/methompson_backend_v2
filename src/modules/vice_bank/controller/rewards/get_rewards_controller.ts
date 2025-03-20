import { Request, Response } from 'express';
import { isString } from 'tcheck';

import { getRewards } from '@/modules/vice_bank/data_controller/purchases/rewards';

export async function getRewardsController(req: Request, res: Response) {
  const { userId } = req.body;

  if (!isString(userId)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const rewards = await getRewards(userId);

    res.json({ rewards });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
