import { Router } from 'express';

import { authCheckMiddleware } from '@/modules/auth/auth_check';

// Init Functions
import { initActions } from '@/modules/vice_bank/data_controller/actions/actions';
import { initActionDeposits } from '@/modules/vice_bank/data_controller/actions/action_deposits';
import { initTaskDeposits } from '@/modules/vice_bank/data_controller/actions/task_deposits';
import { initPurchases } from '@/modules/vice_bank/data_controller/purchases/purchases';
import { initTasks } from '@/modules/vice_bank/data_controller/actions/tasks';
import { initRewards } from '@/modules/vice_bank/data_controller/purchases/rewards';
import { initUsers } from '@/modules/vice_bank/data_controller/user/user';

// Action Controllers
import { addActionController } from '@/modules/vice_bank/controller/actions/add_action_controller';
import { getActionsController } from '@/modules/vice_bank/controller/actions/get_actions_controller';
import { updateActionController } from '@/modules/vice_bank/controller/actions/update_action_controller';
import { deleteActionController } from '@/modules/vice_bank/controller/actions/delete_action_controller';

// Task Controllers
import { getTasksController } from '@/modules/vice_bank/controller/tasks/get_tasks_controller';
import { addTaskController } from '@/modules/vice_bank/controller/tasks/add_task_controller';
import { updateTaskController } from '@/modules/vice_bank/controller/tasks/update_task_controller';
import { deleteTaskController } from '@/modules/vice_bank/controller/tasks/delete_task_controller';

// Action Deposit Controllers
import { getActionDepositsController } from '@/modules/vice_bank/controller/action_deposits/get_action_deposits_controller';
import { addActionDepositController } from '@/modules/vice_bank/controller/action_deposits/add_action_deposit_controller';
import { updateActionDepositController } from '@/modules/vice_bank/controller/action_deposits/update_action_deposit_controller';
import { deleteActionDepositController } from '@/modules/vice_bank/controller/action_deposits/delete_action_deposit_controller';

// Task Deposit Controllers
import { getTaskDepositsController } from '@/modules/vice_bank/controller/task_deposits/get_task_deposits_controller';
import { addTaskDepositController } from '@/modules/vice_bank/controller/task_deposits/add_task_deposit_controller';
import { updateTaskDepositController } from '@/modules/vice_bank/controller/task_deposits/update_task_deposit_controller';
import { deleteTaskDepositController } from '@/modules/vice_bank/controller/task_deposits/delete_task_deposit_controller';

// Purchases Controllers
import { getPurchasesController } from '@/modules/vice_bank/controller/purchases/get_purchases_controller';
import { addPurchaseController } from '@/modules/vice_bank/controller/purchases/add_purchase_controller';
import { updatePurchaseController } from '@/modules/vice_bank/controller/purchases/update_purchase_controller';
import { deletePurchaseController } from '@/modules/vice_bank/controller/purchases/delete_purchase_controller';

// Rewards Controllers
import { getRewardsController } from '@/modules/vice_bank/controller/rewards/get_rewards_controller';
import { addRewardController } from '@/modules/vice_bank/controller/rewards/add_reward_controller';
import { updateRewardController } from '@/modules/vice_bank/controller/rewards/update_reward_controller';
import { deleteRewardController } from '@/modules/vice_bank/controller/rewards/delete_reward_controller';

// User Controllers
import { getUsersController } from '@/modules/vice_bank/controller/user/get_users_controller';
import { addUserController } from '@/modules/vice_bank/controller/user/add_user_controller';
import { updateUserController } from '@/modules/vice_bank/controller/user/update_user_controller';
import { deleteUserController } from '@/modules/vice_bank/controller/user/delete_user_controller';

async function initDataControllers() {
  await Promise.all([
    initActions(),
    initActionDeposits(),
    initTaskDeposits(),
    initTasks(),
    initPurchases(),
    initRewards(),
    initUsers(),
  ]);
}

export async function makeViceBankApp() {
  await initDataControllers();

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

  router.get('/actionDeposits', getActionDepositsController);
  router.post('addActionDeposit', addActionDepositController);
  router.post('/updateActionDeposit', updateActionDepositController);
  router.post('/deleteActionDeposit', deleteActionDepositController);

  // #endregion

  // #region Task Deposits

  router.get('/taskDeposits', getTaskDepositsController);
  router.post('/addTaskDeposit', addTaskDepositController);
  router.post('/updateTaskDeposit', updateTaskDepositController);
  router.post('/deleteTaskDeposit', deleteTaskDepositController);

  // #endregion

  // #region Purchases

  router.get('/purchases', getPurchasesController);
  router.post('/addPurchase', addPurchaseController);
  router.post('/updatePurchase', updatePurchaseController);
  router.post('/deletePurchase', deletePurchaseController);

  // #endregion

  // #region Rewards

  router.get('/rewards', getRewardsController);
  router.post('/addReward', addRewardController);
  router.post('/updateReward', updateRewardController);
  router.post('/deleteReward', deleteRewardController);

  // #endregion

  // #region User

  router.get('/users', getUsersController);
  router.post('/addUser', addUserController);
  router.post('/updateUser', updateUserController);
  router.post('/deleteUser', deleteUserController);

  // #endregion

  return router;
}
