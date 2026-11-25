export function createDebouncedSave<T>({
  save,
  delayMs,
}: {
  save: (value: T) => void;
  delayMs: number;
}) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let pending: { value: T } | undefined;

  function cancel() {
    clearTimeout(timeout);
    timeout = undefined;
    pending = undefined;
  }

  function flush() {
    if (!pending) return;
    const { value } = pending;
    cancel();
    save(value);
  }

  function schedule(value: T) {
    clearTimeout(timeout);
    pending = { value };
    timeout = setTimeout(flush, delayMs);
  }

  return { schedule, flush, cancel };
}
