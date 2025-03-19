import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { isNumber, isString, typeGuardGenerator } from 'tcheck';

import { Task } from '@vice_bank/models/task';
import { addTask } from '@/modules/vice_bank/data_controller/actions/tasks';

interface AddTaskRequest {
  userId: string;
  name: string;
  frequency: string;
  tokensEarnedPerInput: number;
}

const isAddTaskRequest = typeGuardGenerator<AddTaskRequest>({
  userId: isString,
  name: isString,
  frequency: isString,
  tokensEarnedPerInput: isNumber,
});

export async function addTaskController(req: Request, res: Response) {
  const { taskToAdd } = req.body;

  if (!isAddTaskRequest(taskToAdd)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const task = new Task({
      id: uuidv4(),
      userId: taskToAdd.userId,
      name: taskToAdd.name,
      frequency: taskToAdd.frequency,
      tokensEarnedPerInput: taskToAdd.tokensEarnedPerInput,
    });

    await addTask(task);

    res.json({ task });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
