import { Request, Response } from 'express';

import { Purchase } from '@vice_bank/models/purchase';
import { updatePurchase } from '@/modules/vice_bank/data_controller/purchases/purchases';

export async function updatePurchaseController(req: Request, res: Response) {
  const body = req.body;

  let update: Purchase;

  try {
    update = Purchase.fromJSON(body.purchase);
  } catch (_e) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const result = await updatePurchase(update);

    res.json({ purchase: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
