import { Request } from 'express';
import { isNumber, isString } from 'tcheck';

export class AuthModel {
  protected _jwt: string;
  protected _decodedToken: Record<string, unknown>;

  constructor(jwt: string, decodedToken: Record<string, unknown>) {
    this._jwt = jwt;
    this._decodedToken = decodedToken;
  }

  get jwt(): string {
    return this._jwt;
  }
  get decodedToken(): Record<string, unknown> {
    return { ...this._decodedToken };
  }

  get authorized(): boolean {
    return (
      Object.keys(this.decodedToken).length > 0 &&
      this.isNotExpired &&
      this.correctIss
    );
  }

  get isNotExpired(): boolean {
    const expRaw = this.decodedToken?.exp;

    const exp = isNumber(expRaw) ? expRaw : 0;

    return exp >= new Date().getTime() / 1000;
  }

  get userId(): string {
    const userId = this._decodedToken?.sub;
    if (isString(userId)) {
      return userId;
    }

    return '';
  }

  get correctIss(): boolean {
    const iss = this.decodedToken?.iss ?? '';
    if (!isString(iss)) {
      return false;
    }

    return iss.includes('methompson-site');
  }
}

export interface METBackendRequest extends Request {
  authModel?: AuthModel;
}
