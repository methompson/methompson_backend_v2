import { Request, Response } from 'express';
import { isString, typeGuardGenerator } from 'tcheck';

import { getAction } from '@/modules/vice_bank/data_controller/actions/actions';

interface GetActionsRequest {
  id: string;
  userId: string;
}

const isGetActionsRequest = typeGuardGenerator<GetActionsRequest>({
  id: isString,
  userId: isString,
});

export async function getActionsController(req: Request, res: Response) {
  const body = req.body;

  if (isGetActionsRequest(body)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const actions = await getAction(body.actionId, body.userId);

    res.json({ actions });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
