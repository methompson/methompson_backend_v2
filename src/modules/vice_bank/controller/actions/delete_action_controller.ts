import { Request, Response } from 'express';
import { isString } from 'tcheck';

import { deleteAction } from '@/modules/vice_bank/data_controller/actions/actions';

export async function deleteActionController(req: Request, res: Response) {
  const { actionId } = req.body;

  if (!isString(actionId)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const action = await deleteAction(actionId);

    res.json({ action });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
