import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  isNumber,
  isString,
  isUndefined,
  typeGuardGenerator,
  unionGuard,
} from 'tcheck';

import { addAction } from '@/modules/vice_bank/data_controller/actions/actions';
import { Action } from '@vice_bank/models/action';

interface AddActionRequest {
  userId: string;
  name: string;
  conversionUnit: string;
  inputQuantity: number;
  tokensEarnedPerInput: number;
  minDeposit: number;
  maxDeposit?: number;
}

const isAddActionRequest = typeGuardGenerator<AddActionRequest>({
  userId: isString,
  name: isString,
  conversionUnit: isString,
  inputQuantity: isNumber,
  tokensEarnedPerInput: isNumber,
  minDeposit: isNumber,
  maxDeposit: unionGuard(isNumber, isUndefined),
});

export async function addActionController(req: Request, res: Response) {
  const { action } = req.body;

  if (!isAddActionRequest(action)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const actionToAdd = new Action({
      id: uuidv4(),
      userId: action.userId,
      name: action.name,
      conversionUnit: action.conversionUnit,
      inputQuantity: action.inputQuantity,
      tokensEarnedPerInput: action.tokensEarnedPerInput,
      minDeposit: action.minDeposit,
      maxDeposit: action.maxDeposit,
    });

    await addAction(actionToAdd);

    res.json({ action: actionToAdd });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
