import { Either } from './Either';

interface FieldError<Err> {
  field: string;
  error: Err;
}

type Tuple<T, U> = [T, U];

type ErrorsSuccesses<Err> = Tuple<FieldError<Err>[], Record<string, unknown>>;

const zipFields = <Err>([errors, successes]: ErrorsSuccesses<Err>, [field, either]: [string, Either<Err, unknown>]): ErrorsSuccesses<Err> =>
  either
    .mapRight<ErrorsSuccesses<Err>>((value) => [errors, { ...successes, [field]: value }])
    .rightOrElse((error) => [[...errors, { field, error }], successes]);

export const validate = <T extends Record<string, unknown>, Err>(fields: {
  [P in keyof T]: Either<Err, T[P]>;
}): Either<FieldError<Err>[], T> => {
  const entries: [string, Either<Err, unknown>][] = Object.entries(fields);
  const [left, right] = entries.reduce<ErrorsSuccesses<Err>>(zipFields, [[], {}]);

  if (Object.values(left).length > 0) {
    return Either.left(left);
  }

  return Either.right(right as T);
};
