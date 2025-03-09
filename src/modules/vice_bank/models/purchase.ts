import { DateTime } from 'luxon';
import {
  isNumber,
  isString,
  typeGuardGenerator,
  typeGuardTestGenerator,
} from 'tcheck';

import { InvalidInputError } from '@/utils/errors';
import { isValidDateTimeString } from '@/utils/type_guard';

export interface PurchaseJSON {
  id: string;
  vbUserId: string;
  purchasePriceId: string;
  purchasedName: string;
  date: string;
  purchasedQuantity: number;
  tokensSpent: number;
}

const isPurchaseJSONCommon = {
  id: isString,
  vbUserId: isString,
  purchasePriceId: isString,
  purchasedName: isString,
  date: isValidDateTimeString,
  purchasedQuantity: isNumber,
  tokensSpent: isNumber,
};

const isPurchaseJSON = typeGuardGenerator<PurchaseJSON>(isPurchaseJSONCommon);
const isPurchaseJSONTest = typeGuardTestGenerator(isPurchaseJSONCommon);

export class Purchase {
  constructor(
    protected _id: string,
    protected _vbUserId: string,
    protected _purchasePriceId: string,
    protected _purchasedName: string,
    protected _date: DateTime<true>,
    protected _purchasedQuantity: number,
    protected _tokensSpent: number,
  ) {}

  get id(): string {
    return this._id;
  }

  get vbUserId(): string {
    return this._vbUserId;
  }

  get purchasePriceId(): string {
    return this._purchasePriceId;
  }

  get date(): DateTime<true> {
    return this._date;
  }

  get purchasedQuantity(): number {
    return this._purchasedQuantity;
  }

  get purchasedName(): string {
    return this._purchasedName;
  }

  get tokensSpent(): number {
    return this._tokensSpent;
  }

  toJSON(): PurchaseJSON {
    return {
      id: this.id,
      vbUserId: this.vbUserId,
      purchasePriceId: this.purchasePriceId,
      date: this.date.toISO(),
      purchasedQuantity: this.purchasedQuantity,
      purchasedName: this.purchasedName,
      tokensSpent: this.tokensSpent,
    };
  }

  static fromJSON(input: unknown): Purchase {
    if (!Purchase.isPurchaseJSON(input)) {
      const errors = Purchase.PurchaseJSONTest(input);
      throw new InvalidInputError(`Invalid JSON ${errors.join(', ')}`);
    }

    const dateTime = DateTime.fromISO(input.date);
    if (!dateTime.isValid) {
      throw new InvalidInputError('Invalid date');
    }

    return new Purchase(
      input.id,
      input.vbUserId,
      input.purchasePriceId,
      input.purchasedName,
      dateTime,
      input.purchasedQuantity,
      input.tokensSpent,
    );
  }

  static isPurchaseJSON = isPurchaseJSON;

  static PurchaseJSONTest = isPurchaseJSONTest;

  static fromNewPurchase(id: string, purchase: Purchase): Purchase {
    return Purchase.fromJSON({
      ...purchase.toJSON(),
      id,
    });
  }
}
