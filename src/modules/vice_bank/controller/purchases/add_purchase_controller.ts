import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { isNumber, isString, typeGuardGenerator } from 'tcheck';

import { Reward, RewardJSON } from '@vice_bank/models/reward';
import { isValidDateTimeString } from '@vice_bank/utils/type_guards';
import { Purchase } from '@vice_bank/models/purchase';
import { addPurchase } from '@/modules/vice_bank/data_controller/purchases/purchases';

interface AddPurchaseRequest {
  userId: string;
  date: string;
  purchasedQuantity: number;
  reward: RewardJSON;
}

const isAddPurchaseRequest = typeGuardGenerator<AddPurchaseRequest>({
  userId: isString,
  date: isValidDateTimeString,
  purchasedQuantity: isNumber,
  reward: Reward.isRewardJSON,
});

export async function addPurchaseController(req: Request, res: Response) {
  const { purchase } = req.body;

  if (!isAddPurchaseRequest(purchase)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const newPurchase = new Purchase({
      id: uuidv4(),
      userId: purchase.userId,
      date: purchase.date,
      purchasedQuantity: purchase.purchasedQuantity,
      reward: purchase.reward,
    });

    await addPurchase(newPurchase);

    res.json({ purchase: newPurchase });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
