import { Request, Response } from 'express';

import { Reward } from '@vice_bank/models/reward';
import { updateReward } from '@/modules/vice_bank/data_controller/purchases/rewards';

export async function updateRewardController(req: Request, res: Response) {
  const body = req.body;

  let update: Reward;

  try {
    update = Reward.fromJSON(body.reward);
  } catch (_e) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const result = await updateReward(update);

    res.json({ reward: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
