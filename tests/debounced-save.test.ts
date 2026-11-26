import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createDebouncedSave } from "#/features/editor/debounced-save";

const DELAY_MS = 500;

function setUp() {
  const save = vi.fn<(value: string) => void>();
  return { save, saver: createDebouncedSave({ save, delayMs: DELAY_MS }) };
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("createDebouncedSave", () => {
  it("saves the latest value once after the delay", () => {
    const { save, saver } = setUp();
    saver.schedule("a");
    vi.advanceTimersByTime(DELAY_MS - 1);
    saver.schedule("ab");
    vi.advanceTimersByTime(DELAY_MS - 1);
    expect(save).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(save).toHaveBeenCalledExactlyOnceWith("ab");
  });

  it("saves right away on flush, and not again later", () => {
    const { save, saver } = setUp();
    saver.schedule("a");
    saver.flush();
    expect(save).toHaveBeenCalledExactlyOnceWith("a");
    vi.advanceTimersByTime(DELAY_MS);
    expect(save).toHaveBeenCalledOnce();
  });

  it("drops a pending save on cancel", () => {
    const { save, saver } = setUp();
    saver.schedule("a");
    saver.cancel();
    vi.advanceTimersByTime(DELAY_MS);
    expect(save).not.toHaveBeenCalled();
  });

  it("does nothing on flush without a pending save", () => {
    const { save, saver } = setUp();
    saver.flush();
    expect(save).not.toHaveBeenCalled();
  });
});
