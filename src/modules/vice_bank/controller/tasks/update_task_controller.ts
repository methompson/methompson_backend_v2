import { Task } from '@vice_bank/models/task';
import { Request, Response } from 'express';
import { updateTask } from '@/modules/vice_bank/data_controller/actions/tasks';

export async function updateTaskController(req: Request, res: Response) {
  const { task } = req.body;

  let update: Task;

  try {
    update = Task.fromJSON(task);
  } catch (_e) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const result = await updateTask(update);

    res.json({ task: result });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
