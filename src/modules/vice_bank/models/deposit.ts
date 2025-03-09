import { DateTime } from 'luxon';
import {
  isNumber,
  isString,
  typeGuardGenerator,
  typeGuardTestGenerator,
} from 'tcheck';

import { InvalidInputError } from '@/utils/errors';
import { isValidDateTimeString } from '@/utils/type_guard';

export interface DepositJSON {
  id: string;
  vbUserId: string;
  date: string;
  depositQuantity: number;
  conversionRate: number;
  actionName: string;
  actionId: string;
  conversionUnit: string;
}

const isDepositJSONCommon = {
  id: isString,
  vbUserId: isString,
  date: isValidDateTimeString,
  depositQuantity: isNumber,
  conversionRate: isNumber,
  actionName: isString,
  actionId: isString,
  conversionUnit: isString,
};

const isDepositJSON = typeGuardGenerator<DepositJSON>(isDepositJSONCommon);
const isDepositJSONTest = typeGuardTestGenerator(isDepositJSONCommon);

export class Deposit {
  constructor(
    protected _id: string,
    protected _vbUserId: string,
    protected _date: DateTime<true>,
    protected _depositQuantity: number,
    protected _conversionRate: number,
    protected _actionId: string,
    protected _actionName: string,
    protected _conversionUnit: string,
  ) {}

  get id(): string {
    return this._id;
  }
  get vbUserId(): string {
    return this._vbUserId;
  }
  get date(): DateTime<true> {
    return this._date;
  }
  get depositQuantity(): number {
    return this._depositQuantity;
  }
  get conversionRate(): number {
    return this._conversionRate;
  }
  get actionId(): string {
    return this._actionId;
  }
  get actionName(): string {
    return this._actionName;
  }
  get conversionUnit(): string {
    return this._conversionUnit;
  }
  get tokensEarned(): number {
    return this._depositQuantity * this._conversionRate;
  }

  toJSON(): DepositJSON {
    return {
      id: this.id,
      vbUserId: this.vbUserId,
      date: this.date.toISO(),
      depositQuantity: this.depositQuantity,
      conversionRate: this.conversionRate,
      actionId: this.actionId,
      actionName: this.actionName,
      conversionUnit: this.conversionUnit,
    };
  }

  copyWith(input: Record<string, unknown>): Deposit {
    return Deposit.fromJSON({
      ...this.toJSON(),
      ...input,
    });
  }

  static fromJSON(input: unknown): Deposit {
    if (!Deposit.isDepositJSON(input)) {
      const errors = Deposit.DepositJSONTest(input);
      throw new InvalidInputError(`Invalid JSON ${errors.join(', ')}`);
    }

    const dateTime = DateTime.fromISO(input.date, { zone: 'America/Chicago' });
    if (!dateTime.isValid) {
      throw new InvalidInputError('Invalid date');
    }

    return new Deposit(
      input.id,
      input.vbUserId,
      dateTime,
      input.depositQuantity,
      input.conversionRate,
      input.actionId,
      input.actionName,
      input.conversionUnit,
    );
  }

  static isDepositJSON = isDepositJSON;

  static DepositJSONTest = isDepositJSONTest;

  static fromNewDeposit(id: string, input: Deposit): Deposit {
    return Deposit.fromJSON({
      ...input.toJSON(),
      id,
    });
  }
}
