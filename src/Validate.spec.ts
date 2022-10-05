import { describe, expect, it } from 'vitest';

import { Either } from './Either';
import { validate } from './Validate';

describe('Validate', () => {
  it('Should have errors', () => {
    validate({
      first: Either.right<Error, string>('First'),
      second: Either.left(new Error('This is a second error')),
      third: Either.left(new Error('This is a third error')),
      fourth: Either.right<Error, number>(0),
    }).do(
      (errors) => {
        expect(errors).toHaveLength(2);

        const [firstError, secondError] = errors;

        expect(firstError.field).toBe('second');
        expect(firstError.error).toEqual(new Error('This is a second error'));

        expect(secondError.field).toBe('third');
        expect(secondError.error).toEqual(new Error('This is a third error'));
      },
      () => {
        throw new Error('Should not pass');
      }
    );
  });

  it('Should validate fields', () => {
    validate({
      first: Either.right<Error, string>('First'),
      second: Either.right<Error, Date>(new Date('2022-01-01T00:00:00Z')),
      third: Either.right<Error, number>(42),
      fourth: Either.right<Error, number>(0),
    }).do(
      () => {
        throw new Error('Should not have errors');
      },
      (value) => {
        expect(value.first).toBe('First');
        expect(value.second).toEqual(new Date('2022-01-01T00:00:00Z'));
        expect(value.third).toBe(42);
        expect(value.fourth).toBe(0);
      }
    );
  });
});
