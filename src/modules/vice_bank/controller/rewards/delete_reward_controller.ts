import { Request, Response } from 'express';
import { isString } from 'tcheck';

import { deleteReward } from '@/modules/vice_bank/data_controller/purchases/rewards';

export async function deleteRewardController(req: Request, res: Response) {
  const { rewardId } = req.body;

  if (!isString(rewardId)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const reward = await deleteReward(rewardId);

    res.json({ reward });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
