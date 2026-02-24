import { deepStrictEqual, rejects, throws } from 'node:assert/strict';
import test from 'node:test';

import { returnResult } from '../return_result.js';

const tests = [
  {
    args: {of: 'foo'},
    description: 'Return a specific result',
    error: null,
    expected: 'bar',
    result: {err: undefined, res: 'bar'},
  },
  {
    args: {},
    description: 'Return nothing',
    expected: undefined,
    result: {err: null, res: 'bar'},
  },
  {
    args: {},
    description: 'Failure',
    error: [500, 'Failure'],
    expected: undefined,
    result: {err: [500, 'Failure']},
  },
];

test('A callback or promise function is required', (t, end) => {
  throws(
    () => returnResult({}),
    new Error('ExpectedCbkOrPromiseFunctionsToReturnResult')
  );

  return end();
});

for (const { args, description, error, expected, result } of tests) {
  const promise = (err, resolution) => new Promise((resolve, reject) => {
    returnResult({reject, resolve, of: args.of})(err, resolution);
  });

  test(description, async () => {
    // Promise methods
    if (error) {
      await rejects(promise(error), result.err);
    } else {
      deepStrictEqual(await promise(null, { foo: result.res }), expected);
    }

    // Callback methods
    return returnResult(args, (err, res) => {
      deepStrictEqual(err, error, 'Callback returns error');
      deepStrictEqual(res, expected, 'Callback returns result');

      return;
    })(result.err, { foo: result.res });
  })
}
