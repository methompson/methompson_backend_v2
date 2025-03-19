import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { isNumber, isString, typeGuardGenerator } from 'tcheck';

import { Reward } from '@vice_bank/models/reward';
import { addReward } from '@/modules/vice_bank/data_controller/purchases/rewards';

interface AddRewardRequest {
  userId: string;
  name: string;
  price: number;
}

const isAddRewardRequest = typeGuardGenerator<AddRewardRequest>({
  userId: isString,
  name: isString,
  price: isNumber,
});

export async function addRewardController(req: Request, res: Response) {
  const { reward } = req.body;

  if (!isAddRewardRequest(reward)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const newReward = new Reward({
      id: uuidv4(),
      userId: reward.userId,
      name: reward.name,
      price: reward.price,
    });

    await addReward(newReward);

    res.json({ reward: newReward });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
