import { Request, Response } from 'express';
import { isString } from 'tcheck';

import { getActionDeposits } from '@/modules/vice_bank/data_controller/actions/action_deposits';

export async function getActionDepositsController(req: Request, res: Response) {
  const { userId } = req.body;

  if (!isString(userId)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const actionDeposits = await getActionDeposits(userId);

    res.json({ actionDeposits });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
