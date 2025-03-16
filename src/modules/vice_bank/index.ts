import { Router } from 'express';

// Action Controllers
import { addActionController } from '@/modules/vice_bank/controller/add_action_controller';
import { getActionsController } from '@/modules/vice_bank/controller/get_actions_controller';
import { updateActionController } from '@/modules/vice_bank/controller/update_action_controller';
import { deleteActionController } from '@/modules/vice_bank/controller/delete_action_controller';

import { authCheckMiddleware } from '@/modules/auth/auth_check';
import { initActions } from './data_controller/actions/actions';

export async function makeViceBankApp() {
  await initActions();
  const router = Router();

  router.use(authCheckMiddleware);

  // #region Actions & Tasks

  router.get('/actions', getActionsController);
  router.post('/addAction', addActionController);
  router.post('/updateAction', updateActionController);
  router.post('/deleteAction', deleteActionController);

  // #endregion

  return router;
}
