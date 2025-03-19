import { Request, Response } from 'express';
import { isString } from 'tcheck';

import { getTasks } from '@/modules/vice_bank/data_controller/actions/tasks';

export async function getTasksController(req: Request, res: Response) {
  const { userId } = req.body;

  if (!isString(userId)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const tasks = await getTasks(userId);

    res.json({ tasks });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
