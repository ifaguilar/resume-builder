import { describe, expect, it, vi } from "vitest";

import { createLatestRender } from "#/features/pdf-preview/latest-render";

function setup() {
  const pending: {
    value: string;
    resolve: (result: string) => void;
    reject: (reason: unknown) => void;
  }[] = [];
  const onResult = vi.fn<(result: string) => void>();
  const onError = vi.fn<() => void>();
  const preview = createLatestRender<string, string>({
    render: (value) =>
      new Promise<string>((resolve, reject) => {
        pending.push({ value, resolve, reject });
      }),
    onResult,
    onError,
  });
  return { preview, pending, onResult, onError };
}

async function settle() {
  await vi.waitFor(() => Promise.resolve());
}

describe("createLatestRender", () => {
  it("delivers a finished render", async () => {
    const { preview, pending, onResult } = setup();
    preview.request("a");
    pending[0]?.resolve("A");
    await settle();
    expect(onResult).toHaveBeenCalledWith("A");
  });

  it("runs one render at a time and only the newest waiting request", async () => {
    const { preview, pending, onResult } = setup();
    preview.request("a");
    preview.request("b");
    preview.request("c");
    expect(pending.map(({ value }) => value)).toEqual(["a"]);

    pending[0]?.resolve("A");
    await settle();
    expect(pending.map(({ value }) => value)).toEqual(["a", "c"]);
    expect(onResult).not.toHaveBeenCalled();

    pending[1]?.resolve("C");
    await settle();
    expect(onResult).toHaveBeenCalledExactlyOnceWith("C");
  });

  it("reports a failed render", async () => {
    const { preview, pending, onResult, onError } = setup();
    preview.request("a");
    pending[0]?.reject(new Error("render failed"));
    await settle();
    expect(onError).toHaveBeenCalledOnce();
    expect(onResult).not.toHaveBeenCalled();
  });

  it("delivers nothing after it is disposed", async () => {
    const { preview, pending, onResult } = setup();
    preview.request("a");
    preview.request("b");
    preview.dispose();
    pending[0]?.resolve("A");
    await settle();
    expect(pending).toHaveLength(1);
    expect(onResult).not.toHaveBeenCalled();
  });
});
