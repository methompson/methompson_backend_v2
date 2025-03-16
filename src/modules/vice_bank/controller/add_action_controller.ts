import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { addAction } from '@/modules/vice_bank/data_controller/actions/actions';
import { Action } from '@vice_bank/models/action';
import {
  isNumber,
  isString,
  isUndefined,
  typeGuardGenerator,
  unionGuard,
} from 'tcheck';

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
  const body = req.body;

  if (!isAddActionRequest(body)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const action = new Action({
      id: uuidv4(),
      userId: body.userId,
      name: body.name,
      conversionUnit: body.conversionUnit,
      inputQuantity: body.inputQuantity,
      tokensEarnedPerInput: body.tokensEarnedPerInput,
      minDeposit: body.minDeposit,
      maxDeposit: body.maxDeposit,
    });

    await addAction(action);

    res.json({ action });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
