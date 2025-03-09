import {
  isNumber,
  isString,
  typeGuardGenerator,
  typeGuardTestGenerator,
} from 'tcheck';

import { InvalidInputError } from '@/utils/errors';
import { Frequency, frequencyFromString, isFrequency } from '@/utils/types';

export interface TaskJSON {
  id: string;
  vbUserId: string;
  name: string;
  frequency: string;
  tokensPer: number;
}

const isTaskJSONCommon = {
  id: isString,
  vbUserId: isString,
  name: isString,
  frequency: isFrequency,
  tokensPer: isNumber,
};

const isTaskJSON = typeGuardGenerator<TaskJSON>(isTaskJSONCommon);
const isTaskJSONTest = typeGuardTestGenerator(isTaskJSONCommon);

export class Task {
  constructor(
    protected _id: string,
    protected _vbUserId: string,
    protected _name: string,
    protected _frequency: Frequency,
    protected _tokensPer: number,
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

  get frequency(): Frequency {
    return this._frequency;
  }

  get tokensPer(): number {
    return this._tokensPer;
  }

  toJSON(): TaskJSON {
    return {
      id: this.id,
      vbUserId: this.vbUserId,
      name: this.name,
      frequency: this.frequency,
      tokensPer: this.tokensPer,
    };
  }

  static fromJSON(input: unknown): Task {
    if (!Task.isTaskJSON(input)) {
      const errors = Task.TaskJSONTest(input);
      throw new InvalidInputError(`Invalid JSON ${errors.join(', ')}`);
    }

    return new Task(
      input.id,
      input.vbUserId,
      input.name,
      frequencyFromString(input.frequency),
      input.tokensPer,
    );
  }

  static isTaskJSON = isTaskJSON;

  static TaskJSONTest = isTaskJSONTest;

  static fromNewTask(id: string, input: Task): Task {
    return Task.fromJSON({ ...input.toJSON(), id });
  }
}
