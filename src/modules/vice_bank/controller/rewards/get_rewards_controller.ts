import { Request, Response } from 'express';
import { isString } from 'tcheck';

export async function getTaskDepositController(req: Request, res: Response) {
  const { userId } = req.body;

  if (!isString(userId)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const taskDeposits = await getTaskDeposits(userId);

    res.json({ taskDeposits });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
