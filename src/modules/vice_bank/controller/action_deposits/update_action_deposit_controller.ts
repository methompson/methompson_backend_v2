import { ActionDeposit } from '@vice_bank/models/action_deposit';
import { Request, Response } from 'express';

import { updateActionDeposit } from '@/modules/vice_bank/data_controller/actions/action_deposits';

export async function updateActionDepositController(
  req: Request,
  res: Response,
) {
  const body = req.body;

  let update: ActionDeposit;

  try {
    update = ActionDeposit.fromJSON(body.actionDeposit);
  } catch (_e) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const result = await updateActionDeposit(update);

    res.json({ actionDeposit: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
