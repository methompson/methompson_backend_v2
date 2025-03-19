import { Request, Response } from 'express';
import { isString } from 'tcheck';

import { deleteTask } from '@/modules/vice_bank/data_controller/actions/tasks';

export async function deleteTaskController(req: Request, res: Response) {
  const { taskId } = req.body;

  if (!isString(taskId)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const task = await deleteTask(taskId);

    res.json({ task });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
