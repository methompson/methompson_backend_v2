import {
  isNumber,
  isString,
  typeGuardGenerator,
  typeGuardTestGenerator,
} from 'tcheck';

import { InvalidInputError } from '@/utils/errors';

export interface ViceBankUserJSON {
  id: string;
  userId: string;
  name: string;
  currentTokens: number;
}

const isViceBankUserJSONCommon = {
  id: isString,
  userId: isString,
  name: isString,
  currentTokens: isNumber,
};
const isViceBankUserJSON = typeGuardGenerator<ViceBankUserJSON>(
  isViceBankUserJSONCommon,
);
const isViceBankUserJSONTest = typeGuardTestGenerator(isViceBankUserJSONCommon);

export class ViceBankUser {
  protected _id: string;
  protected _userId: string;
  protected _name: string;
  protected _currentTokens: number;

  constructor(payload: ViceBankUserJSON) {
    this._id = payload.id;
    this._userId = payload.userId;
    this._name = payload.name;
    this._currentTokens = payload.currentTokens;
  }

  get id(): string {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get name(): string {
    return this._name;
  }
  get currentTokens(): number {
    return this._currentTokens;
  }

  toJSON(): ViceBankUserJSON {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      currentTokens: this.currentTokens,
    };
  }

  copyWith(input: Record<string, unknown>): ViceBankUser {
    return new ViceBankUser({
      ...this.toJSON(),
      ...input,
    });
  }

  static fromJSON(input: unknown): ViceBankUser {
    if (!ViceBankUser.isViceBankUserJSON(input)) {
      const errors = ViceBankUser.ViceBankUserJSONTest(input);
      throw new InvalidInputError(`Invalid JSON ${errors.join(', ')}`);
    }

    return new ViceBankUser(input);
  }

  static isViceBankUserJSON = isViceBankUserJSON;

  static ViceBankUserJSONTest = isViceBankUserJSONTest;

  static fromNewViceBankUser(id: string, input: ViceBankUser): ViceBankUser {
    return new ViceBankUser({
      ...input.toJSON(),
      id,
    });
  }
}
