import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  isNumber,
  isString,
  isUndefined,
  typeGuardGenerator,
  unionGuard,
} from 'tcheck';

import { ViceBankUser } from '@vice_bank/models/vice_bank_user';
import { METBackendRequest } from '@/modules/auth/auth_model';
import { addViceBankUser } from '@/modules/vice_bank/data_controller/user/user';

interface AddUserRequest {
  name: string;
  currentTokens?: number;
}

const isAddUserRequest = typeGuardGenerator<AddUserRequest>({
  name: isString,
  currentTokens: unionGuard(isUndefined, isNumber),
});

export async function addUserController(req: METBackendRequest, res: Response) {
  const userId = req.authModel?.userId;
  if (!userId) {
    res.status(401).json({
      error: 'Unauthorized',
    });
    return;
  }

  const { userToAdd } = req.body;

  if (!isAddUserRequest(userToAdd)) {
    res.status(400).json({
      error: 'Invalid request body',
    });
    return;
  }

  try {
    const user = new ViceBankUser({
      id: uuidv4(),
      userId,
      name: userToAdd.name,
      currentTokens: userToAdd.currentTokens ?? 0,
    });

    await addViceBankUser(user);

    res.json({ user });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: 'Internal server error',
    });
  }
}
