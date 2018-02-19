/**
 * This is a description of `foo()`.
 * @param bar The parameter `bar`.
 * @return The return value.
 */
function foo<T, U extends string>(bar: T): U {
  return bar.toString() as U;
}
