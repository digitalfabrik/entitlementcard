extension PutBetween<T> on Iterable<T> {
  Iterable<T> putBetween(T t(T elementAfter)) =>
    expand((item) sync* {
      yield t(item);
      yield item;
    })
    .skip(1);
}
