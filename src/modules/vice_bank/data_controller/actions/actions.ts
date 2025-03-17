import { Action } from '@vice_bank/models/action';
import {
  FileDataService,
  getBaseFilePath,
} from '@/modules/vice_bank/data_controller/file_data_service';
import { NotFoundError } from '@/utils/errors';

class ActionDataService extends FileDataService<Action> {
  parseData(data: unknown): Action {
    return Action.fromJSON(data);
  }

  async getActionsByUser(userId: string): Promise<Action[]> {
    const actions = Object.values(this._data).filter(
      (action) => action.userId === userId,
    );

    return actions;
  }
}

const actionService = new ActionDataService(getBaseFilePath(), 'actions');
export async function initActions() {
  await actionService.init();
}

export async function getActions(userId: string) {
  return actionService.getActionsByUser(userId);
}

export async function getAction(actionId: string, userId: string) {
  const action = await actionService.getDataById(actionId);

  if (action.userId !== userId) {
    throw new NotFoundError('Action not found');
  }

  return action;
}

export async function addAction(action: Action) {
  return actionService.addData({ data: action });
}

export async function updateAction(action: Action) {
  return actionService.updateData({ data: action });
}

export async function deleteAction(actionId: string) {
  return actionService.deleteData({ id: actionId });
}

export async function clearActions() {
  await actionService.clearFile();
}
