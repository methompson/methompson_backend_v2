import {
  isNumber,
  isString,
  typeGuardGenerator,
  typeGuardTestGenerator,
} from 'tcheck';

import { InvalidInputError } from '@/utils/errors';

export interface PurchasePriceJSON {
  id: string;
  userId: string;
  name: string;
  price: number;
}

const isPurchasePriceJSONCommon = {
  id: isString,
  userId: isString,
  name: isString,
  price: isNumber,
};

const isPurchasePriceJSON = typeGuardGenerator<PurchasePriceJSON>(
  isPurchasePriceJSONCommon,
);
const isPurchasePriceJSONTest = typeGuardTestGenerator(
  isPurchasePriceJSONCommon,
);

export class PurchasePrice {
  protected _id: string;
  protected _userId: string;
  protected _name: string;
  protected _price: number;

  constructor(input: PurchasePriceJSON) {
    this._id = input.id;
    this._userId = input.userId;
    this._name = input.name;
    this._price = input.price;
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
  get price(): number {
    return this._price;
  }

  toJSON(): PurchasePriceJSON {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      price: this.price,
    };
  }

  static fromJSON(input: unknown): PurchasePrice {
    if (!PurchasePrice.isPurchasePriceJSON(input)) {
      const errors = PurchasePrice.PurchasePriceJSONTest(input);
      throw new InvalidInputError(`Invalid JSON ${errors.join(', ')}`);
    }

    return new PurchasePrice(input);
  }

  static isPurchasePriceJSON = isPurchasePriceJSON;
  static PurchasePriceJSONTest = isPurchasePriceJSONTest;

  static fromNewPurchasePrice(
    id: string,
    purchasePrice: PurchasePrice,
  ): PurchasePrice {
    return new PurchasePrice({
      ...purchasePrice.toJSON(),
      id,
    });
  }
}
