import { Either } from './Either';

type Tuple<T, U> = [T, U];

type ErrorsSuccesses = Tuple<Record<string, unknown>, Record<string, unknown>>;

type RightOf<T> = T extends Either<unknown, infer V> ? V : never;

type LeftOf<T> = T extends Either<infer V, unknown> ? V : never;

type ToValue<T extends Record<string, Either<unknown, unknown>>> = { [P in keyof T]: RightOf<T[P]> };

const zipFields = ([errors, successes]: ErrorsSuccesses, [field, either]: [string, Either<unknown, unknown>]): ErrorsSuccesses =>
  either
    .mapRight<ErrorsSuccesses>((value) => [errors, { ...successes, [field]: value }])
    .rightOrElse((error) => [{ ...errors, [field]: error }, successes]);

type ToError<T extends Record<string, Either<unknown, unknown>>> = Partial<{ [P in keyof T]: LeftOf<T[P]> }>;

export const validate = <T extends Record<string, Either<unknown, unknown>>>(fields: T): Either<ToError<T>, ToValue<T>> => {
  const entries: [string, Either<unknown, unknown>][] = Object.entries(fields);
  const [left, right] = entries.reduce<ErrorsSuccesses>(zipFields, [{}, {}]);

  if (Object.values(left).length > 0) {
    return Either.left(left as ToError<T>);
  }

  return Either.right(right as { [P in keyof T]: RightOf<T[P]> });
};
