extension PutBetween<T> on Iterable<T> {
  Iterable<T> putBetween(T Function(T elementAfter) t) => expand((item) sync* {
        yield t(item);
        yield item;
      }).skip(1);
}
