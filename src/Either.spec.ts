import { describe, expect, it } from 'vitest';

import { Either } from './Either';

describe('Either', () => {
  describe('Right', () => {
    const RIGHT = Either.right('Right');

    it('Should do right', () => {
      RIGHT.do(
        (error) => {
          throw error;
        },
        (value) => expect(value).toBe('Right')
      );
    });

    it('Should get', () => {
      const right = RIGHT.rightOrElse(() => 'Other');

      expect(right).toBe('Right');
    });

    it('Should map right', () => {
      const right = Either.right('42')
        .mapRight((value) => +value)
        .rightOrElse(() => 33);

      expect(right).toBe(42);
    });

    it('Should chain', () => {
      const right = Either.right('42')
        .chain(
          (error) => Either.left(error),
          (value) => Either.right(+value)
        )
        .rightOrElse(() => 33);

      expect(right).toBe(42);
    });

    it('Should map', () => {
      const right = Either.right('42')
        .map(
          (error) => error,
          (value) => +value
        )
        .rightOrElse(() => 33);

      expect(right).toBe(42);
    });

    it('Should try', () => {
      Either.try(() => 'Right').do(
        () => {
          throw new Error("Try should not be in error when it's valid");
        },
        (value) => expect(value).toBe('Right')
      );
    });

    it('Should not throw', () => {
      expect(RIGHT.rightOrThrow()).toBe('Right');
    });
  });

  describe('Left', () => {
    const LEFT = Either.left('Left');

    it('Should do right', () => {
      LEFT.do(
        (error) => expect(error).toBe('Left'),
        (value) => {
          throw value;
        }
      );
    });

    it('Should get', () => {
      const left = LEFT.rightOrElse((error) => error);

      expect(left).toBe('Left');
    });

    it('Should not map right', () => {
      const left = Either.left<string, number>('Left')
        .mapRight((value) => value.toString())
        .rightOrElse((error) => error);

      expect(left).toBe('Left');
    });

    it('Should chain', () => {
      const left = Either.left<string, number>('33')
        .chain(
          (error) => Either.left(+error),
          (value) => Either.right(value)
        )
        .rightOrElse((error) => error);

      expect(left).toBe(33);
    });

    it('Should map', () => {
      const left = Either.left<string, number>('33')
        .map(
          (error) => +error,
          (value) => value
        )
        .rightOrElse((error) => error);

      expect(left).toBe(33);
    });

    it('Should try', () => {
      Either.try(() => {
        throw 'Left';
      }).do(
        (error) => expect(error).toEqual('Left'),
        () => {
          throw new Error('Try not catch anything');
        }
      );
    });

    it('Should throw', () => {
      expect(() => LEFT.rightOrThrow()).toThrow('Left');
    });
  });
});
