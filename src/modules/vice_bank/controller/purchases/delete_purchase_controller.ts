import { Request, Response } from 'express';
import { isString } from 'tcheck';

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
