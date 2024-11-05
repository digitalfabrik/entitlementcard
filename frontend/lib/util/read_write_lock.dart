import 'package:mutex/mutex.dart';

class ReadWriteLock<T> {
  final mutex = Mutex();
  final T obj;

  ReadWriteLock(this.obj);

  /// Allows exclusive access to the protected object.
  /// Users are responsible to not leak any reference to the protected object outside the critical section.
  Future<R> use<R>(Future<R> Function(T) criticalSection) async {
    return await mutex.protect(() async => await criticalSection(obj));
  }
}
