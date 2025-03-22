import {
  addAction,
  clearActions,
  deleteAction,
  getAction,
  initActions,
  updateAction,
} from '@/modules/vice_bank/data_controller/actions/actions';
import { Action } from '@vice_bank/models/action';

describe('testing the actions data controller', () => {
  const act = new Action({
    id: '2',
    userId: 'user1',
    name: 'Test Action',
    conversionUnit: 'minutes',
    inputQuantity: 60,
    tokensEarnedPerInput: 1,
    minDeposit: 1,
    maxDeposit: 10,
  });

  const udpatedAction = new Action({
    ...act.toJSON(),
    name: 'Updated Test Action',
    inputQuantity: 120,
  });

  test('clear', async () => {
    await clearActions();
  });

  test('init', async () => {
    await initActions();
  });

  test('adding an action', async () => {
    await addAction(act);
  });

  test('getting the action', async () => {
    const value = await getAction(act.id, act.userId);
    expect(value.toJSON()).toEqual(act.toJSON());
  });

  test('updateting an action', async () => {
    const result = await updateAction(udpatedAction);
    expect(result.toJSON()).toEqual(act.toJSON());

    const value = await getAction(act.id, act.userId);
    expect(value.toJSON()).toEqual(udpatedAction.toJSON());
  });

  test('deleting an action', async () => {
    const result = await deleteAction(act.id);
    expect(result.toJSON()).toEqual(udpatedAction.toJSON());
  });
});
