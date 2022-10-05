type Fun<T, U> = (value: T) => U;

type Consumer<T> = Fun<T, void>;

export abstract class Either<L, R> {
  static try<Err, Value>(throwable: () => Value): Either<Err, Value> {
    try {
      return Either.right(throwable());
    } catch (e) {
      return Either.left(e as Err);
    }
  }
  static left<Err, Value>(error: Err): Either<Err, Value> {
    return new Left<Err, Value>(error);
  }
  static right<Err, Value>(value: Value): Either<Err, Value> {
    return new Right<Err, Value>(value);
  }
  abstract do(left: Consumer<L>, right: Consumer<R>): void;

  abstract rightOrElse(left: (value: L) => R): R;

  abstract mapRight<Value>(transform: Fun<R, Value>): Either<L, Value>;

  abstract chain<Err, Value>(transformLeft: Fun<L, Either<Err, Value>>, transformRight: Fun<R, Either<Err, Value>>): Either<Err, Value>;

  abstract map<Err, Value>(transformLeft: Fun<L, Err>, transformRight: Fun<R, Value>): Either<Err, Value>;

  abstract rightOrThrow(): R;
}

class Right<L, R> extends Either<L, R> {
  constructor(private readonly value: R) {
    super();
  }
  do(_: Consumer<L>, right: Consumer<R>): void {
    right(this.value);
  }

  rightOrElse(): R {
    return this.value;
  }

  mapRight<Value>(transform: Fun<R, Value>): Either<L, Value> {
    return Either.right<L, Value>(transform(this.value));
  }

  chain<Err, Value>(_: Fun<L, Either<Err, Value>>, transformRight: Fun<R, Either<Err, Value>>): Either<Err, Value> {
    return transformRight(this.value);
  }

  map<Err, Value>(_: Fun<L, Err>, transformRight: Fun<R, Value>): Either<Err, Value> {
    return Either.right(transformRight(this.value));
  }

  rightOrThrow(): R {
    return this.value;
  }
}

class Left<L, R> extends Either<L, R> {
  constructor(private readonly error: L) {
    super();
  }
  do(left: Consumer<L>): void {
    left(this.error);
  }

  rightOrElse(left: (value: L) => R): R {
    return left(this.error);
  }

  mapRight<Value>(): Either<L, Value> {
    return Either.left<L, Value>(this.error);
  }

  chain<Error, Value>(transformLeft: Fun<L, Either<Error, Value>>): Either<Error, Value> {
    return transformLeft(this.error);
  }

  map<Error, Value>(transformLeft: Fun<L, Error>): Either<Error, Value> {
    return Either.left(transformLeft(this.error));
  }

  rightOrThrow(): R {
    throw this.error;
  }
}
