import {
  isNumber,
  isString,
  isUndefined,
  typeGuardGenerator,
  typeGuardTestGenerator,
  unionGuard,
} from 'tcheck';

import { InvalidInputError } from '@/utils/errors';

/**
 * The JSON representation of an Action that can be deposited.
 * id is the Action's unique identifier.
 * userId is the user's unique identifier. Each user has its own set of actions
 * name is the name of the action
 * conversionUnit is the unit of the action. For instance, "minutes" or "each"
 * inputQuantity is the quantity of the conversion unit that the user deposits for conversion
 * tokensEarnedPer is the number of tokens the user earns per inputQuantity
 * minDeposit is the minimum quantity of inputQuantity that the user can deposit
 */
export interface ActionJSON {
  id: string;
  userId: string;
  name: string;
  conversionUnit: string;
  inputQuantity: number;
  tokensEarnedPerInput: number;
  minDeposit: number;
  maxDeposit?: number | undefined;
}

const isActionJSONCommon = {
  id: isString,
  userId: isString,
  name: isString,
  conversionUnit: isString,
  inputQuantity: isNumber,
  tokensEarnedPerInput: isNumber,
  minDeposit: isNumber,
  maxDeposit: unionGuard(isNumber, isUndefined),
};
const isActionJSON = typeGuardGenerator<ActionJSON>(isActionJSONCommon);
const isActionJSONTest = typeGuardTestGenerator(isActionJSONCommon);

/**
 * This class represents an action
 * This allows a user to define a type of conversion, the quantity to deposit of the
 * user's action and the amount of tokens you get from this deposit. This allows a
 * user the flexibility to deposit values and get whole tokens or fractions of tokens.
 * For instance, a user could define 15 minutes of walking getting you 1/4 of a token.
 * Or, 1 hour of walking getting you 1 token. Both should result in the same conversion.
 * A user can also define a different kind of conversion, such as taking 10 photos in
 * a day getting you 0.25 tokens, but not allowing you to deposit 5 photos and get 0.125
 * or 40 photos and get 1 token.
 */
export class Action {
  protected _id: string;
  protected _userId: string;
  protected _name: string;
  protected _conversionUnit: string;
  protected _inputQuantity: number;
  protected _tokensEarnedPerInput: number;
  protected _minDeposit: number;
  protected _maxDeposit?: number;

  constructor(payload: ActionJSON) {
    this._id = payload.id;
    this._userId = payload.userId;
    this._name = payload.name;
    this._conversionUnit = payload.conversionUnit;
    this._inputQuantity = payload.inputQuantity;
    this._tokensEarnedPerInput = payload.tokensEarnedPerInput;
    this._minDeposit = payload.minDeposit;
    this._maxDeposit = payload.maxDeposit;
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
  get conversionUnit(): string {
    return this._conversionUnit;
  }
  get inputQuantity(): number {
    return this._inputQuantity;
  }
  get tokensEarnedPerInput(): number {
    return this._tokensEarnedPerInput;
  }
  get minDeposit(): number {
    return this._minDeposit;
  }
  get maxDeposit(): number | undefined {
    return this._maxDeposit;
  }

  get conversionRate(): number {
    return this.inputQuantity / this.tokensEarnedPerInput;
  }

  toJSON(): ActionJSON {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      conversionUnit: this.conversionUnit,
      inputQuantity: this.inputQuantity,
      tokensEarnedPerInput: this.tokensEarnedPerInput,
      minDeposit: this.minDeposit,
      maxDeposit: this.maxDeposit,
    };
  }

  static fromJSON(input: unknown): Action {
    if (!Action.isActionJSON(input)) {
      const errors = Action.ActionJSONTest(input);
      throw new InvalidInputError(`Invalid JSON ${errors.join(', ')}`);
    }

    return new Action(input);
  }

  static fromNewAction(id: string, input: Action): Action {
    return new Action({
      ...input.toJSON(),
      id,
    });
  }

  static isActionJSON = isActionJSON;
  static ActionJSONTest = isActionJSONTest;
}
