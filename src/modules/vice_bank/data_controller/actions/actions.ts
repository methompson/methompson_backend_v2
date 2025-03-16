import { isArray } from 'tcheck';

import { Action } from '@vice_bank/models/action';
import {
  FileDataService,
  getBaseFilePath,
} from '@/modules/vice_bank/data_controller/file_data_service';
import { arrayToObject } from '@/utils/array_to_obj';
import { NotFoundError } from '@/utils/errors';

// This class will be used to interact with a file to
// store and retrieve actions
class ActionDataService extends FileDataService {
  protected _actions: Record<string, Action> = {};

  get actionString() {
    return JSON.stringify(Object.values(this._actions));
  }

  get actions() {
    return { ...this._actions };
  }

  async getActionById(id: string): Promise<Action> {
    const action = this._actions[id];

    if (!action) {
      throw new NotFoundError('Action not found');
    }

    return action;
  }

  async getActionsByUser(userId: string): Promise<Action[]> {
    const actions = Object.values(this._actions).filter(
      (action) => action.userId === userId,
    );

    return actions;
  }

  async addAction(action: Action): Promise<Action> {
    const oldAction = this._actions[action.id];

    if (oldAction) {
      throw new Error('Action already exists');
    }

    this._actions[action.id] = action;

    await this.writeActionsToFile();

    return action;
  }

  async updateAction(action: Action): Promise<Action> {
    const oldAction = this._actions[action.id];

    if (!oldAction) {
      throw new NotFoundError('Action not found');
    }

    this._actions[action.id] = action;

    await this.writeActionsToFile();

    return oldAction;
  }

  async deleteAction(actionId: string): Promise<Action> {
    const oldAction = this._actions[actionId];

    if (!oldAction) {
      throw new NotFoundError('Action not found');
    }

    delete this._actions[actionId];

    await this.writeActionsToFile();

    return oldAction;
  }

  async writeActionsToFile() {
    await this.writeDataToFile({
      path: this.filePath,
      filename: `${this.baseFilename}.json`,
      content: this.actionString,
    });
  }

  async init() {
    const dataStr = await this.readFile(this.filePath);

    try {
      const rawData = JSON.parse(dataStr);

      if (!isArray(rawData)) {
        throw new Error('Data is not an array');
      }

      const actions: Action[] = [];
      for (const dat of rawData) {
        const action = Action.fromJSON(dat);
        actions.push(action);
      }

      this._actions = arrayToObject(actions, (a) => a.id);
    } catch (e) {
      console.error('Error parsing data', e);

      await this.clearFile();
    }
  }

  async clearFile() {
    return super.clearFile(this.filePath);
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
  const action = await actionService.getActionById(actionId);

  if (action.userId !== userId) {
    throw new NotFoundError('Action not found');
  }

  return action;
}

export async function addAction(action: Action) {
  return actionService.addAction(action);
}

export async function updateAction(action: Action) {
  return actionService.updateAction(action);
}

export async function deleteAction(actionId: string) {
  return actionService.deleteAction(actionId);
}

export async function clearActions() {
  await actionService.clearFile();
}
