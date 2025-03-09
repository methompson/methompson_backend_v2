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
  userId: string;
  name: string;
  frequency: string;
  tokensEarnedPerInput: number;
}

const isTaskJSONCommon = {
  id: isString,
  userId: isString,
  name: isString,
  frequency: isFrequency,
  tokensEarnedPerInput: isNumber,
};

const isTaskJSON = typeGuardGenerator<TaskJSON>(isTaskJSONCommon);
const isTaskJSONTest = typeGuardTestGenerator(isTaskJSONCommon);

export class Task {
  protected _id: string;
  protected _userId: string;
  protected _name: string;
  protected _frequency: Frequency;
  protected _tokensEarnedPerInput: number;

  constructor(payload: TaskJSON) {
    this._id = payload.id;
    this._userId = payload.userId;
    this._name = payload.name;
    this._frequency = frequencyFromString(payload.frequency);
    this._tokensEarnedPerInput = payload.tokensEarnedPerInput;
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
  get frequency(): Frequency {
    return this._frequency;
  }
  get tokensEarnedPerInput(): number {
    return this._tokensEarnedPerInput;
  }

  toJSON(): TaskJSON {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      frequency: this.frequency,
      tokensEarnedPerInput: this.tokensEarnedPerInput,
    };
  }

  static fromJSON(input: unknown): Task {
    if (!Task.isTaskJSON(input)) {
      const errors = Task.TaskJSONTest(input);
      throw new InvalidInputError(`Invalid JSON ${errors.join(', ')}`);
    }

    return new Task(input);
  }

  static isTaskJSON = isTaskJSON;

  static TaskJSONTest = isTaskJSONTest;

  static fromNewTask(id: string, input: Task): Task {
    return new Task({ ...input.toJSON(), id });
  }
}
