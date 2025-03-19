import { Request, Response } from 'express';
import { isString } from 'tcheck';
import { deleteTaskDeposit } from '@/modules/vice_bank/data_controller/actions/task_deposits';

export async function deleteTaskDepositController(req: Request, res: Response) {
  const { taskDepositId } = req.body;

  if (!isString(taskDepositId)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const taskDeposit = await deleteTaskDeposit(taskDepositId);

    res.json({ taskDeposit });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
