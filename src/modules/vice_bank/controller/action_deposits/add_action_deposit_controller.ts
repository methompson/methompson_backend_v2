import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { isNumber, isString, typeGuardGenerator } from 'tcheck';

import { Action, ActionJSON } from '@vice_bank/models/action';
import { ActionDeposit } from '@vice_bank/models/action_deposit';
import { isValidDateTimeString } from '@vice_bank/utils/type_guards';
import { addActionDeposit } from '@/modules/vice_bank/data_controller/actions/action_deposits';

interface AddActionDepositRequest {
  userId: string;
  date: string;
  depositQuantity: number;
  action: ActionJSON;
}

const isAddActionDepositRequest = typeGuardGenerator<AddActionDepositRequest>({
  userId: isString,
  date: isValidDateTimeString,
  depositQuantity: isNumber,
  action: Action.isActionJSON,
});

export async function addActionDepositController(req: Request, res: Response) {
  const { actionDeposit } = req.body;

  if (!isAddActionDepositRequest(actionDeposit)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const deposit = new ActionDeposit({
      id: uuidv4(),
      date: actionDeposit.date,
      userId: actionDeposit.userId,
      depositQuantity: actionDeposit.depositQuantity,
      action: actionDeposit.action,
    });

    await addActionDeposit(deposit);

    res.json({ actionDeposit: deposit });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
