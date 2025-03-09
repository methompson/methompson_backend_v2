import {
  isNumber,
  isString,
  typeGuardGenerator,
  typeGuardTestGenerator,
} from 'tcheck';

import { InvalidInputError } from '@/utils/errors';

export interface PurchasePriceJSON {
  id: string;
  vbUserId: string;
  name: string;
  price: number;
}

const isPurchasePriceJSONCommon = {
  id: isString,
  vbUserId: isString,
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
  constructor(
    protected _id: string,
    protected _vbUserId: string,
    protected _name: string,
    protected _price: number,
  ) {}

  get id(): string {
    return this._id;
  }
  get vbUserId(): string {
    return this._vbUserId;
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
      vbUserId: this.vbUserId,
      name: this.name,
      price: this.price,
    };
  }

  static fromJSON(input: unknown): PurchasePrice {
    if (!PurchasePrice.isPurchasePriceJSON(input)) {
      const errors = PurchasePrice.PurchasePriceJSONTest(input);
      throw new InvalidInputError(`Invalid JSON ${errors.join(', ')}`);
    }

    return new PurchasePrice(input.id, input.vbUserId, input.name, input.price);
  }

  static isPurchasePriceJSON = isPurchasePriceJSON;

  static PurchasePriceJSONTest = isPurchasePriceJSONTest;

  static fromNewPurchasePrice(
    id: string,
    purchasePrice: PurchasePrice,
  ): PurchasePrice {
    return PurchasePrice.fromJSON({
      ...purchasePrice.toJSON(),
      id,
    });
  }
}
