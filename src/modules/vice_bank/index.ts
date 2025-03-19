import { Router } from 'express';

// Action Controllers
import { addActionController } from '@/modules/vice_bank/controller/actions/add_action_controller';
import { getActionsController } from '@/modules/vice_bank/controller/actions/get_actions_controller';
import { updateActionController } from '@/modules/vice_bank/controller/actions/update_action_controller';
import { deleteActionController } from '@/modules/vice_bank/controller/actions/delete_action_controller';

import { authCheckMiddleware } from '@/modules/auth/auth_check';
import { initActions } from './data_controller/actions/actions';
import { getTasksController } from './controller/tasks/get_tasks_controller';
import { addTaskController } from './controller/tasks/add_task_controller';
import { updateTaskController } from './controller/tasks/update_task_controller';
import { deleteTaskController } from './controller/tasks/delete_task_controller';

export async function makeViceBankApp() {
  await initActions();
  const router = Router();

  router.use(authCheckMiddleware);

  // #region Actions

  router.get('/actions', getActionsController);
  router.post('/addAction', addActionController);
  router.post('/updateAction', updateActionController);
  router.post('/deleteAction', deleteActionController);

  // #endregion

  // #region Tasks

  router.get('/tasks', getTasksController);
  router.post('/addTask', addTaskController);
  router.post('/updateTask', updateTaskController);
  router.post('/deleteTask', deleteTaskController);

  // #endregion

  // #region Action Deposits
  // #endregion

  // #region Task Deposits
  // #endregion

  // #region User
  // #endregion

  return router;
}
