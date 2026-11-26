// Runs one render at a time. A request that arrives mid-render waits, and only
// the newest waiting one runs; a result that is already outdated is dropped.
export function createLatestRender<T, R>({
  render,
  onResult,
  onError,
}: {
  render: (value: T) => Promise<R>;
  onResult: (result: R) => void;
  onError: () => void;
}) {
  let running = false;
  let disposed = false;
  let queued: { value: T } | undefined;

  async function run(value: T) {
    running = true;
    try {
      const result = await render(value);
      if (!disposed && queued === undefined) onResult(result);
    } catch {
      if (!disposed && queued === undefined) onError();
    }
    running = false;
    const next = queued;
    queued = undefined;
    if (next && !disposed) void run(next.value);
  }

  function request(value: T) {
    if (disposed) return;
    if (running) {
      queued = { value };
      return;
    }
    void run(value);
  }

  function dispose() {
    disposed = true;
    queued = undefined;
  }

  return { request, dispose };
}
