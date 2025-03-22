import { Request, Response } from 'express';

import { Action, ActionJSON } from '@vice_bank/models/action';
import { addActionController } from '@/modules/vice_bank/controller/actions/add_action_controller';

jest.mock('@/modules/vice_bank/data_controller/actions/actions', () => {
  const addAction = jest.fn();
  return {
    addAction,
  };
});
jest.mock('uuid', () => ({
  v4: () => 'id-123',
}));

const addAction = jest.requireMock(
  '@/modules/vice_bank/data_controller/actions/actions',
).addAction as jest.Mock;

const errorSpy = jest.spyOn(console, 'error');

describe('add action controller', () => {
  const actionJSON: ActionJSON = {
    id: '1',
    userId: 'user1',
    name: 'Test Action',
    conversionUnit: 'minutes',
    inputQuantity: 60,
    tokensEarnedPerInput: 1,
    minDeposit: 1,
    maxDeposit: 10,
  };
  const action = new Action(actionJSON);

  beforeEach(() => {
    addAction.mockReset();
    errorSpy.mockReset();
  });

  test('happy path', async () => {
    const status = jest.fn(() => ({ json }));
    const json = jest.fn();
    const res = {
      status,
      json,
    } as unknown as Response;

    const req = {
      body: {
        action: actionJSON,
      },
    } as Request;

    addAction.mockResolvedValue(action);

    await addActionController(req, res);

    expect(addAction).toHaveBeenCalledWith(
      new Action({
        ...action.toJSON(),
        id: 'id-123',
      }),
    );
    expect(status).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith({
      action: { ...action.toJSON(), id: 'id-123' },
    });
    expect(errorSpy).not.toHaveBeenCalled();
  });

  test('sends 400 status if the body is invalid', async () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const res = {
      status,
      json,
    } as unknown as Response;

    const req = {
      body: {
        action: { id: '1' }, // Invalid action
      },
    } as Request;

    await addActionController(req, res);

    expect(errorSpy).not.toHaveBeenCalled();
    expect(addAction).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: 'Invalid request body',
    });
  });

  test('sends 500 if addAction fails', async () => {
    const status = jest.fn(() => ({ json }));
    const json = jest.fn();
    const res = {
      status,
      json,
    } as unknown as Response;

    const req = {
      body: {
        action: actionJSON,
      },
    } as Request;

    const testErr = new Error('Failed to add action');
    addAction.mockRejectedValueOnce(testErr);

    await addActionController(req, res);

    expect(addAction).toHaveBeenCalledWith(
      new Action({
        ...action.toJSON(),
        id: 'id-123',
      }),
    );
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: 'Internal server error',
    });
    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(testErr);
  });
});
