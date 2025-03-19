import { Request, Response } from 'express';

import { Action } from '@vice_bank/models/action';
import { updateAction } from '@/modules/vice_bank/data_controller/actions/actions';

export async function updateActionController(req: Request, res: Response) {
  const { action } = req.body;

  let update: Action;

  try {
    update = Action.fromJSON(action);
  } catch (_e) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const result = await updateAction(update);

    res.json({ action: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
