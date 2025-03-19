import { Request, Response } from 'express';
import { isString } from 'tcheck';

import { deleteActionDeposit } from '@/modules/vice_bank/data_controller/actions/action_deposits';

export async function deleteActionDepositController(
  req: Request,
  res: Response,
) {
  const { actionDepositId } = req.body;

  if (!isString(actionDepositId)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const actionDeposit = await deleteActionDeposit(actionDepositId);

    res.json({ actionDeposit });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
