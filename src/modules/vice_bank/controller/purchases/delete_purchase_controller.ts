import { Request, Response } from 'express';
import { isString } from 'tcheck';
import { deletePurchase } from '@/modules/vice_bank/data_controller/purchases/purchases';

export async function deletePurchaseController(req: Request, res: Response) {
  const { purchaseId } = req.body;

  if (!isString(purchaseId)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const purchase = await deletePurchase(purchaseId);

    res.json({ purchase });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
