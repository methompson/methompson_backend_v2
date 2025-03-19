import { Request, Response } from 'express';

export async function updateTaskDepositController(req: Request, res: Response) {
  const body = req.body;

  let update: TaskDeposit;

  try {
    update = TaskDeposit.fromJSON(body.taskDeposit);
  } catch (_e) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const result = await updateTaskDeposit(update);

    res.json({ taskDeposit: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
