import { addActionController } from '@/modules/vice_bank/controller/actions/add_action_controller';
import { deleteActionController } from '@/modules/vice_bank/controller/actions/delete_action_controller';
import { getActionsController } from '@/modules/vice_bank/controller/actions/get_actions_controller';
import { updateActionController } from '@/modules/vice_bank/controller/actions/update_action_controller';
import {
  clearActions,
  getActions,
  initActions,
} from '@/modules/vice_bank/data_controller/actions/actions';
import { Action } from '@vice_bank/models/action';
import { Request, Response } from 'express';

describe('actions', () => {
  const action = new Action({
    id: '1',
    userId: 'user1',
    name: 'Test Action',
    conversionUnit: 'minutes',
    inputQuantity: 60,
    tokensEarnedPerInput: 1,
    minDeposit: 1,
    maxDeposit: 10,
  });

  let savedAction: Action;

  beforeAll(async () => {
    await initActions();
    await clearActions();
  });

  test('add an action', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = {
      status,
      json,
    } as unknown as Response;

    const req = {
      body: {
        action: action.toJSON(),
      },
    } as Request;

    await addActionController(req, res);

    expect(status).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalled();
  });

  test('get an action', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = {
      status,
      json,
    } as unknown as Response;

    const req = {
      body: {
        userId: action.userId,
      },
    } as Request;

    await getActionsController(req, res);

    expect(status).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalled();
  });

  test('get the action', async () => {
    const actions = await getActions(action.userId);
    expect(actions.length).toBe(1);

    const value = actions[0];
    if (!value) {
      throw new Error('Action not found');
    }

    savedAction = value;
  });

  test('update an action', async () => {
    const updatedAction = new Action({
      ...savedAction.toJSON(),
      name: 'Updated Test Action',
      inputQuantity: 120,
    });

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = {
      status,
      json,
    } as unknown as Response;

    const req = {
      body: {
        action: updatedAction.toJSON(),
      },
    } as Request;

    await updateActionController(req, res);

    expect(status).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalled();
  });

  test('delete an action', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = {
      status,
      json,
    } as unknown as Response;

    const req = {
      body: {
        actionId: savedAction.id,
      },
    } as Request;

    await deleteActionController(req, res);

    expect(status).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalled();
  });
});
