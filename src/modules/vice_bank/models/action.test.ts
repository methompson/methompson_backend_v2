import { Action, ActionJSON } from './action';

describe('Action', () => {
  const validInput: ActionJSON = {
    id: 'id',
    userId: 'userId',
    name: 'name',
    conversionUnit: 'conversionUnit',
    inputQuantity: 1,
    tokensEarnedPerInput: 2,
    minDeposit: 3,
    maxDeposit: 4,
  };

  describe('toJSON', () => {
    test('returns an expected value', () => {
      const action = Action.fromJSON(validInput);

      const result = action.toJSON();

      expect(result).toEqual(validInput);
    });
  });

  describe('fromJSON', () => {
    test('returns a new Action based on valid input', () => {
      const result = Action.fromJSON(validInput);
      expect(result instanceof Action).toBe(true);
      expect(result.id).toBe('id');
      expect(result.userId).toBe('userId');
      expect(result.name).toBe('name');
      expect(result.conversionUnit).toBe('conversionUnit');
      expect(result.inputQuantity).toBe(1);
      expect(result.tokensEarnedPerInput).toBe(2);
      expect(result.minDeposit).toBe(3);
      expect(result.maxDeposit).toBe(4);
    });

    test('throws an error if values are missing from the input', () => {
      let invalidInput: Record<string, unknown> = { ...validInput };

      invalidInput = { ...validInput };
      delete invalidInput.id;
      expect(() => Action.fromJSON(invalidInput)).toThrow();

      invalidInput = { ...validInput };
      delete invalidInput.userId;
      expect(() => Action.fromJSON(invalidInput)).toThrow();

      invalidInput = { ...validInput };
      delete invalidInput.name;
      expect(() => Action.fromJSON(invalidInput)).toThrow();

      invalidInput = { ...validInput };
      delete invalidInput.conversionUnit;
      expect(() => Action.fromJSON(invalidInput)).toThrow();

      invalidInput = { ...validInput };
      delete invalidInput.inputQuantity;
      expect(() => Action.fromJSON(invalidInput)).toThrow();

      invalidInput = { ...validInput };
      delete invalidInput.tokensEarnedPerInput;
      expect(() => Action.fromJSON(invalidInput)).toThrow();

      invalidInput = { ...validInput };
      delete invalidInput.minDeposit;
      expect(() => Action.fromJSON(invalidInput)).toThrow();
    });

    test('does not throw an error for missing non-required values', () => {
      let input: Record<string, unknown> = { ...validInput };

      input = { ...validInput };
      delete input.maxDeposit;
      expect(() => Action.fromJSON(input)).not.toThrow();
    });

    test('throws an error if the input is not an object', () => {
      expect(() => Action.fromJSON('invalidInput')).toThrow();
      expect(() => Action.fromJSON(1)).toThrow();
      expect(() => Action.fromJSON(true)).toThrow();
      expect(() => Action.fromJSON([])).toThrow();
      expect(() => Action.fromJSON(null)).toThrow();
    });
  });

  describe('isActionJSON', () => {
    test('returns true if the input is valid', () => {
      expect(Action.isActionJSON(validInput)).toBe(true);
    });

    test('returns false if the input is missing any value from a valid input', () => {
      let invalidInput: Record<string, unknown> = { ...validInput };

      invalidInput = { ...validInput };
      delete invalidInput.id;
      expect(Action.isActionJSON(invalidInput)).toBe(false);

      invalidInput = { ...validInput };
      delete invalidInput.userId;
      expect(Action.isActionJSON(invalidInput)).toBe(false);

      invalidInput = { ...validInput };
      delete invalidInput.name;
      expect(Action.isActionJSON(invalidInput)).toBe(false);

      invalidInput = { ...validInput };
      delete invalidInput.conversionUnit;
      expect(Action.isActionJSON(invalidInput)).toBe(false);

      invalidInput = { ...validInput };
      delete invalidInput.inputQuantity;
      expect(Action.isActionJSON(invalidInput)).toBe(false);

      invalidInput = { ...validInput };
      delete invalidInput.tokensEarnedPerInput;
      expect(Action.isActionJSON(invalidInput)).toBe(false);

      invalidInput = { ...validInput };
      delete invalidInput.minDeposit;
      expect(Action.isActionJSON(invalidInput)).toBe(false);
    });

    test('returns true for missing non-required values', () => {
      let input: Record<string, unknown> = { ...validInput };

      input = { ...validInput };
      delete input.maxDeposit;
      expect(Action.isActionJSON(input)).toBe(true);
    });

    test('returns false if the input is not an object', () => {
      expect(Action.isActionJSON('invalidInput')).toBe(false);
      expect(Action.isActionJSON(1)).toBe(false);
      expect(Action.isActionJSON(true)).toBe(false);
      expect(Action.isActionJSON([])).toBe(false);
      expect(Action.isActionJSON(null)).toBe(false);
    });
  });

  describe('ActionJSONTest', () => {
    test('returns an empty array if the input is valid', () => {
      expect(Action.ActionJSONTest(validInput)).toEqual([]);
    });

    test('returns an array of strings if the input is missing any value from a valid input', () => {
      let invalidInput: Record<string, unknown> = { ...validInput };

      invalidInput = { ...validInput };
      delete invalidInput.id;
      expect(Action.ActionJSONTest(invalidInput)).toEqual(['id']);

      invalidInput = { ...validInput };
      delete invalidInput.userId;
      expect(Action.ActionJSONTest(invalidInput)).toEqual(['userId']);

      invalidInput = { ...validInput };
      delete invalidInput.name;
      expect(Action.ActionJSONTest(invalidInput)).toEqual(['name']);

      invalidInput = { ...validInput };
      delete invalidInput.conversionUnit;
      expect(Action.ActionJSONTest(invalidInput)).toEqual(['conversionUnit']);

      invalidInput = { ...validInput };
      delete invalidInput.inputQuantity;
      expect(Action.ActionJSONTest(invalidInput)).toEqual(['inputQuantity']);

      invalidInput = { ...validInput };
      delete invalidInput.tokensEarnedPerInput;
      expect(Action.ActionJSONTest(invalidInput)).toEqual([
        'tokensEarnedPerInput',
      ]);

      invalidInput = { ...validInput };
      delete invalidInput.minDeposit;
      expect(Action.ActionJSONTest(invalidInput)).toEqual(['minDeposit']);
    });

    test('returns an empty array for missing non-required values', () => {
      let input: Record<string, unknown> = { ...validInput };

      input = { ...validInput };
      delete input.maxDeposit;
      expect(Action.ActionJSONTest(input)).toEqual([]);
    });

    test('returns root if the input is not an object', () => {
      expect(Action.ActionJSONTest('invalidInput')).toEqual(['root']);
      expect(Action.ActionJSONTest(1)).toEqual(['root']);
      expect(Action.ActionJSONTest(true)).toEqual(['root']);
      expect(Action.ActionJSONTest([])).toEqual(['root']);
      expect(Action.ActionJSONTest(null)).toEqual(['root']);
    });
  });

  describe('fromNewAction', () => {
    test('returns a new Action based on valid input', () => {
      const input = Action.fromJSON(validInput);
      const newId = 'newId';
      const result = Action.fromNewAction(newId, input);

      expect(result instanceof Action).toBe(true);
      expect(result.id).toBe(newId);
      expect(result.userId).toBe(input.userId);
      expect(result.name).toBe(input.name);
      expect(result.conversionUnit).toBe(input.conversionUnit);
      expect(result.inputQuantity).toBe(input.inputQuantity);
      expect(result.tokensEarnedPerInput).toBe(input.tokensEarnedPerInput);
      expect(result.minDeposit).toBe(input.minDeposit);
    });
  });
});
