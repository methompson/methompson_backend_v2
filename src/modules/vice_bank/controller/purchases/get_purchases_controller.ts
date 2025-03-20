import { Request, Response } from 'express';
import { isString } from 'tcheck';
import { getPurchases } from '@/modules/vice_bank/data_controller/purchases/purchases';

export async function getPurchasesController(req: Request, res: Response) {
  const { userId } = req.body;

  if (!isString(userId)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const purchases = await getPurchases(userId);

    res.json({ purchases });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
