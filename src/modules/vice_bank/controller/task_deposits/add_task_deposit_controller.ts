import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { isString, typeGuardGenerator } from 'tcheck';

import { isValidDateTimeString } from '@vice_bank/utils/type_guards';
import { Task, TaskJSON } from '@vice_bank/models/task';
import { TaskDeposit } from '@vice_bank/models/task_deposit';
import { addTaskDeposit } from '@/modules/vice_bank/data_controller/actions/task_deposits';

interface AddTaskDepositRequest {
  userId: string;
  date: string;
  task: TaskJSON;
}

const isAddTaskDepositRequest = typeGuardGenerator<AddTaskDepositRequest>({
  userId: isString,
  date: isValidDateTimeString,
  task: Task.isTaskJSON,
});

export async function addTaskDepositController(req: Request, res: Response) {
  const { taskDeposit } = req.body;

  if (!isAddTaskDepositRequest(taskDeposit)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const deposit = new TaskDeposit({
      id: uuidv4(),
      userId: taskDeposit.userId,
      date: taskDeposit.date,
      task: taskDeposit.task,
    });

    await addTaskDeposit(deposit);

    res.json({ taskDeposit: deposit });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
