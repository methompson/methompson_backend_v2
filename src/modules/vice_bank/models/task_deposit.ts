import { DateTime } from 'luxon';

import { InvalidInputError } from '@/utils/errors';
import {
  isNumber,
  isString,
  typeGuardGenerator,
  typeGuardTestGenerator,
} from 'tcheck';
import { Frequency, frequencyFromString, isFrequency } from '@/utils/types';
import { isValidDateTimeString } from '@/utils/type_guard';

export interface TaskDepositJSON {
  id: string;
  vbUserId: string;
  date: string;
  taskName: string;
  taskId: string;
  conversionRate: number;
  frequency: string;
  tokensEarned: number;
}

const isTaskDepositJSONCommon = {
  id: isString,
  vbUserId: isString,
  date: isValidDateTimeString,
  taskName: isString,
  taskId: isString,
  conversionRate: isNumber,
  frequency: isFrequency,
  tokensEarned: isNumber,
};

const isTaskDepositJSON = typeGuardGenerator<TaskDepositJSON>(
  isTaskDepositJSONCommon,
);
const isTaskDepositJSONTest = typeGuardTestGenerator(isTaskDepositJSONCommon);

export class TaskDeposit {
  constructor(
    protected _id: string,
    protected _vbUserId: string,
    protected _date: DateTime<true>,
    protected _taskName: string,
    protected _taskId: string,
    protected _conversionRate: number,
    protected _frequency: Frequency,
    protected _tokensEarned: number,
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

  get taskName(): string {
    return this._taskName;
  }

  get taskId(): string {
    return this._taskId;
  }

  get conversionRate(): number {
    return this._conversionRate;
  }

  get frequency(): Frequency {
    return this._frequency;
  }

  get tokensEarned(): number {
    return this._tokensEarned;
  }

  toJSON(): TaskDepositJSON {
    return {
      id: this.id,
      vbUserId: this.vbUserId,
      date: this.date.toISO(),
      taskName: this.taskName,
      taskId: this.taskId,
      conversionRate: this.conversionRate,
      frequency: this.frequency,
      tokensEarned: this.tokensEarned,
    };
  }

  withTokensEarned(tokensEarned: number): TaskDeposit {
    return TaskDeposit.fromJSON({
      ...this.toJSON(),
      tokensEarned,
    });
  }

  static fromJSON(input: unknown): TaskDeposit {
    if (!TaskDeposit.isTaskDepositJSON(input)) {
      const errors = TaskDeposit.TaskDepositJSONTest(input);
      throw new InvalidInputError(`Invalid JSON ${errors.join(', ')}`);
    }

    const dateTime = DateTime.fromISO(input.date, { zone: 'America/Chicago' });
    if (!dateTime.isValid) {
      throw new InvalidInputError('Invalid date');
    }

    return new TaskDeposit(
      input.id,
      input.vbUserId,
      dateTime,
      input.taskName,
      input.taskId,
      input.conversionRate,
      frequencyFromString(input.frequency),
      input.tokensEarned,
    );
  }

  static isTaskDepositJSON = isTaskDepositJSON;

  static TaskDepositJSONTest = isTaskDepositJSONTest;

  static fromNewTaskDeposit(id: string, taskDeposit: TaskDeposit): TaskDeposit {
    return TaskDeposit.fromJSON({
      ...taskDeposit.toJSON(),
      id,
    });
  }
}
