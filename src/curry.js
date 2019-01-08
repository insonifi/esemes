export default function curry(fn) {
  function collectArgs(storedArgs, ...args) {
    const fnArgs = [...storedArgs, ...args];

    if (fnArgs.length >= fn.length) {
      return fn.apply(undefined, fnArgs);
    }

    return collectArgs.bind(null, fnArgs);
  }
  return function(...args) {
    return collectArgs.bind(null, args);
  };
}
