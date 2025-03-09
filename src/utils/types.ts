import { Deposit } from '@/modules/vice_bank/models/deposit';
import { TaskDeposit } from '@/modules/vice_bank/models/task_deposit';
import { isString } from 'tcheck';

export interface GetPageOptions {
  page?: number;
  pagination?: number;
}

export interface GetPageAndUserOptions extends GetPageOptions {
  userId: string;
}

export type GetViceBankUsersOptions = GetPageAndUserOptions;

export interface PurchaseInputOptions extends GetPageOptions {
  userId: string;
  startDate?: string;
  endDate?: string;
  purchasePriceId?: string;
}

export interface DepositInputOptions extends GetPageOptions {
  userId: string;
  startDate?: string;
  endDate?: string;
  depositConversionId?: string;
}

export interface GetTaskOptions extends GetPageOptions {
  userId: string;
}

export interface GetTaskDepositOptions extends GetPageOptions {
  userId: string;
  startDate?: string;
  endDate?: string;
  taskId?: string;
}

export enum Frequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export function isFrequency(input: unknown): input is Frequency {
  const values = ['daily', 'weekly', 'monthly'];
  return isString(input) && values.includes(input.toLowerCase());
}

export function frequencyFromString(input: string) {
  switch (input.toLowerCase()) {
    case 'daily':
      return Frequency.Daily;
    case 'weekly':
      return Frequency.Weekly;
    case 'monthly':
      return Frequency.Monthly;
    default:
      throw new Error(`Invalid frequency: ${input}`);
  }
}

export interface TaskDepositResponse {
  taskDeposit: TaskDeposit;
  tokensAdded: number;
}

export interface DepositResponse {
  deposit: Deposit;
  tokensAdded: number;
}
