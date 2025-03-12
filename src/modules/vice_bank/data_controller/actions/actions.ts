import { join } from 'path';
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
  private actions: Record<string, Action> = {};

  get actionString() {
    return JSON.stringify(Object.values(this.actions));
  }

  async getActionById(id: string): Promise<Action> {
    const action = this.actions[id];

    if (!action) {
      throw new NotFoundError('Action not found');
    }

    return action;
  }

  async getActionsByUser(userId: string): Promise<Action[]> {
    const actions = Object.values(this.actions).filter(
      (action) => action.userId === userId,
    );

    return actions;
  }

  async addAction(action: Action) {
    this.actions[action.id] = action;

    await this.writeDataToFile({
      path: this.filePath,
      filename: `${this.baseFilename}.json`,
      content: this.actionString,
    });
  }

  async updateAction(action: Action) {
    const oldAction = this.actions[action.id];

    if (!oldAction) {
      throw new NotFoundError('Action not found');
    }

    this.actions[action.id] = action;

    await this.writeActionsToFile();

    return oldAction;
  }

  async deleteAction(actionId: string) {
    const oldAction = this.actions[actionId];

    if (!oldAction) {
      throw new NotFoundError('Action not found');
    }

    delete this.actions[actionId];

    await this.writeActionsToFile();
  }

  async writeActionsToFile() {
    await this.writeDataToFile({
      path: this.filePath,
      filename: `${this.baseFilename}.json`,
      content: this.actionString,
    });
  }

  async init() {
    const filePath = join(this.filePath, `${this.baseFilename}.json`);
    const dataStr = await this.readFile(filePath);

    try {
      const rawData = JSON.parse(dataStr);

      if (!isArray(rawData)) {
        throw new Error('Data is not an array');
      }

      const actions = [];
      for (const dat of rawData) {
        const action = Action.fromJSON(dat);
        actions.push(action);
      }

      this.actions = arrayToObject(actions, (a) => a.id);
    } catch (e) {
      console.error('Error parsing data', e);
      await this.clearFile(filePath);
    }
  }

  static async initActionDataService() {
    const svc = new ActionDataService(getBaseFilePath(), 'actions');
    await svc.init();
  }
}

const actionService = new ActionDataService(getBaseFilePath(), 'actions');

export async function getActions(userId: string) {
  return actionService.getActionsByUser(userId);
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
