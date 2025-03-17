import {
  FileDataService,
  getBaseFilePath,
} from '@/modules/vice_bank/data_controller/file_data_service';
import { NotFoundError } from '@/utils/errors';
import { ActionDeposit } from '@vice_bank/models/action_deposit';

class ActionDepositService extends FileDataService<ActionDeposit> {
  async getActionDepositsByUser(userId: string): Promise<ActionDeposit[]> {
    const deposits = Object.values(this._data).filter(
      (deposit) => deposit.userId === userId,
    );

    return deposits;
  }

  parseData(data: unknown): ActionDeposit {
    return ActionDeposit.fromJSON(data);
  }
}

const actionDepositService = new ActionDepositService(
  getBaseFilePath(),
  'action_deposits',
);
export async function initActionDeposits() {
  await actionDepositService.init();
}

export async function getActionDeposits(userId: string) {
  return actionDepositService.getActionDepositsByUser(userId);
}

export async function getActionDeposit(depositId: string, userId: string) {
  const deposit = await actionDepositService.getDataById(depositId);

  if (deposit.userId !== userId) {
    throw new NotFoundError('Task not found');
  }

  return deposit;
}

export async function addActionDeposit(deposit: ActionDeposit) {
  return actionDepositService.addData({ data: deposit });
}

export async function updateActionDeposit(deposit: ActionDeposit) {
  return actionDepositService.updateData({ data: deposit });
}

export async function deleteActionDeposit(depositId: string) {
  return actionDepositService.deleteData({ id: depositId });
}

export async function clearActionDeposits() {
  return actionDepositService.clearFile();
}
