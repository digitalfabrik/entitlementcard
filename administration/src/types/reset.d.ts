// From https://github.com/total-typescript/ts-reset under MIT
type NonFalsy<T> = T extends false | 0 | '' | null | undefined | 0n ? never : T

type Array<T> = {
  filter(predicate: BooleanConstructor, thisArg?: unknown): NonFalsy<T>[]
}

type ReadonlyArray<T> = {
  filter(predicate: BooleanConstructor, thisArg?: unknown): NonFalsy<T>[]
}
