import { Request, Response } from 'express';
import { isString } from 'tcheck';

import { getActions } from '@/modules/vice_bank/data_controller/actions/actions';

export async function getActionsController(req: Request, res: Response) {
  const { userId } = req.body;

  if (!isString(userId)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const actions = await getActions(userId);

    res.json({ actions });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
