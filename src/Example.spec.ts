import { describe, expect, it } from 'vitest';

import { Either } from './Either';
class Name {
  private constructor(private readonly name: string) {
    if (name === '') {
      throw new Error('Name should not be empty');
    }
  }

  static of(name: string): Either<Error, Name> {
    return Either.try(() => new Name(name));
  }

  get(): string {
    return this.name;
  }
}
describe('Example', () => {
  describe('Name', () => {
    it('Should not be empty', () => {
      expect(() => Name.of('').rightOrThrow()).toThrow('Name should not be empty');
    });
    it('Should get name', () => {
      expect(Name.of('Name').rightOrThrow().get()).toBe('Name');
    });
  });
});
