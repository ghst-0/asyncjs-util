/** Return a specific result of an async/auto process

  Omit a cbk and specify reject/resolve if using a Promise

  {
    [of]: <Property String>
    [reject]: <Promise Reject Function>
    [resolve]: <Promise Resolve Function>
  }
  [cbk]: <Callback Function>

  @returns
  <Function> (err, res) => {}
*/
export default (args, cbk) => {
  if (!cbk && !(!!args.reject && !!args.resolve)) {
    throw new Error('ExpectedCbkOrPromiseFunctionsToReturnResult');
  }

  return (err, res) => {
    if (err) {
      return cbk ? cbk(err) : args.reject(err);
    }

    if (args.of) {
      return cbk ? cbk(null, res[args.of]) : args.resolve(res[args.of]);
    }

    return cbk ? cbk() : args.resolve();
  };
};
