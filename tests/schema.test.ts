import careerChanger from "@jsonresume/schema/examples/career-changer.resume.json";
import newGrad from "@jsonresume/schema/examples/new-grad.resume.json";
import seniorEngineer from "@jsonresume/schema/examples/senior-engineer.resume.json";
import officialPackage from "@jsonresume/schema/package.json";
import officialSample from "@jsonresume/schema/sample.resume.json";
import officialSchema from "@jsonresume/schema/schema.json";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  JSON_RESUME_SCHEMA_VERSION,
  WARNING_MESSAGES,
} from "#/features/resume/constants";
import { resumeSchema } from "#/features/resume/resume-schema";
import {
  DEFAULT_SETTINGS,
  settingsSchema,
} from "#/features/resume/settings-schema";
import { validateResume } from "#/features/resume/validate-resume";

const fixtures = import.meta.glob<unknown>("/tests/fixtures/*.json", {
  eager: true,
  import: "default",
});

type JsonObject = Record<string, unknown>;

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function childObject(node: JsonObject, key: string): JsonObject {
  const value = node[key];
  return isJsonObject(value) ? value : {};
}

function childList(node: JsonObject, key: string): unknown[] {
  const value = node[key];
  return Array.isArray(value) ? value : [];
}

// Collects every property path a JSON Schema describes, e.g. "work[].location.city",
// following $ref, anyOf/oneOf and array items.
function propertyPaths(root: unknown): Set<string> {
  if (!isJsonObject(root)) throw new Error("Not a JSON Schema object");
  const definitions = {
    ...childObject(root, "definitions"),
    ...childObject(root, "$defs"),
  };
  const paths = new Set<string>();

  const resolve = (node: JsonObject): JsonObject => {
    const ref = node.$ref;
    if (typeof ref !== "string") return node;
    const target = definitions[ref.split("/").at(-1) ?? ""];
    if (!isJsonObject(target)) throw new Error(`Unresolved $ref ${ref}`);
    return resolve(target);
  };

  const walk = (raw: unknown, prefix: string) => {
    if (!isJsonObject(raw)) return;
    const node = resolve(raw);
    for (const branch of [
      ...childList(node, "anyOf"),
      ...childList(node, "oneOf"),
    ]) {
      walk(branch, prefix);
    }
    walk(node.items, `${prefix}[]`);
    for (const [key, child] of Object.entries(
      childObject(node, "properties"),
    )) {
      const path = prefix ? `${prefix}.${key}` : key;
      paths.add(path);
      walk(child, path);
    }
  };

  walk(root, "");
  return paths;
}

function majorMinor(version: string): string {
  return version.split(".").slice(0, 2).join(".");
}

function warningsOf(input: unknown) {
  return validateResume(input).warnings;
}

describe("fixtures", () => {
  it("finds all three fixtures", () => {
    expect(Object.keys(fixtures)).toHaveLength(3);
  });

  it.each(Object.entries(fixtures))("%s has no warnings", (_name, fixture) => {
    expect(warningsOf(fixture)).toEqual([]);
  });
});

describe("official JSON Resume conformance", () => {
  it.each([
    ["sample.resume.json", officialSample],
    ["career-changer", careerChanger],
    ["new-grad", newGrad],
    ["senior-engineer", seniorEngineer],
  ])("%s has no warnings", (_name, resume) => {
    expect(warningsOf(resume)).toEqual([]);
  });

  it("mirrors every field of the installed official schema", () => {
    expect(propertyPaths(z.toJSONSchema(resumeSchema))).toEqual(
      propertyPaths(officialSchema),
    );
  });

  it("targets the installed schema version", () => {
    expect(majorMinor(officialPackage.version)).toBe(
      majorMinor(JSON_RESUME_SCHEMA_VERSION),
    );
  });
});

describe("validateResume", () => {
  it("accepts an empty resume", () => {
    expect(warningsOf({})).toEqual([]);
  });

  it.each([null, [], "resume", 1])(
    "warns once when the input is %j",
    (input) => {
      expect(warningsOf(input)).toEqual([
        { path: [], message: WARNING_MESSAGES.notAnObject },
      ]);
    },
  );

  it("reports unknown keys at their full path and keeps the data unchanged", () => {
    const input = {
      nickname: "Jo",
      basics: { name: "Jo", twitter: "@jo" },
      work: [{ name: "A" }, { name: "B", salary: 1 }],
    };
    const before = structuredClone(input);
    expect(warningsOf(input)).toEqual(
      expect.arrayContaining([
        {
          path: ["nickname"],
          message: WARNING_MESSAGES.unknownKey("nickname"),
        },
        {
          path: ["basics", "twitter"],
          message: WARNING_MESSAGES.unknownKey("twitter"),
        },
        {
          path: ["work", 1, "salary"],
          message: WARNING_MESSAGES.unknownKey("salary"),
        },
      ]),
    );
    expect(warningsOf(input)).toHaveLength(3);
    expect(input).toEqual(before);
  });

  it("never warns about custom data", () => {
    const resume = {
      custom: { tool: { nested: [1, { deep: true }] } },
      basics: { custom: { anything: "goes" } },
      skills: [{ name: "Go", custom: { years: 5 } }],
    };
    expect(warningsOf(resume)).toEqual([]);
  });

  it("warns about a bad email", () => {
    expect(warningsOf({ basics: { email: "not-an-email" } })).toEqual([
      { path: ["basics", "email"], message: WARNING_MESSAGES.email },
    ]);
  });

  it("treats empty email, url and date fields as not filled in", () => {
    const resume = {
      basics: { email: "", url: "" },
      work: [{ startDate: "", endDate: "", url: "" }],
    };
    expect(warningsOf(resume)).toEqual([]);
  });

  it.each(["www.example.com", "javascript:alert(1)", "mailto:a@example.com"])(
    "warns about the url %s",
    (url) => {
      expect(warningsOf({ basics: { url } })).toEqual([
        { path: ["basics", "url"], message: WARNING_MESSAGES.url },
      ]);
    },
  );

  it.each(["2023-4", "23-04", "2023-13", "2023-04-1", "April 2023"])(
    "warns about the malformed date %s",
    (startDate) => {
      expect(warningsOf({ work: [{ startDate }] })).toEqual([
        { path: ["work", 0, "startDate"], message: WARNING_MESSAGES.date },
      ]);
    },
  );

  it.each(["2023-02-30", "2023-04-31", "2023-02-29"])(
    "warns once about the nonexistent date %s",
    (date) => {
      expect(warningsOf({ awards: [{ date }] })).toEqual([
        {
          path: ["awards", 0, "date"],
          message: WARNING_MESSAGES.nonexistentDate,
        },
      ]);
    },
  );

  it.each(["2023", "2023-04", "2024-02-29"])(
    "accepts the date %s",
    (startDate) => {
      expect(warningsOf({ work: [{ startDate }] })).toEqual([]);
    },
  );

  it("reports a wrong field inside an entry location object", () => {
    expect(warningsOf({ work: [{ location: { city: 1 } }] })).toEqual([
      { path: ["work", 0, "location", "city"], message: expect.any(String) },
    ]);
  });

  it("reports an unknown key inside an entry location object", () => {
    expect(
      warningsOf({ volunteer: [{ location: { city: "x", zip: "1" } }] }),
    ).toEqual([
      {
        path: ["volunteer", 0, "location", "zip"],
        message: WARNING_MESSAGES.unknownKey("zip"),
      },
    ]);
  });

  it("warns when an entry location is neither text nor an address", () => {
    expect(warningsOf({ education: [{ location: 5 }] })).toEqual([
      {
        path: ["education", 0, "location"],
        message: WARNING_MESSAGES.location,
      },
    ]);
  });

  it("allows extra string identifiers on publications", () => {
    expect(
      warningsOf({ publications: [{ identifiers: { ssrn: "123" } }] }),
    ).toEqual([]);
  });

  it("reports wrong types at their path", () => {
    expect(warningsOf({ work: [{ highlights: "Did things" }] })).toEqual([
      { path: ["work", 0, "highlights"], message: expect.any(String) },
    ]);
  });
});

describe("settings", () => {
  it("accepts the default settings", () => {
    expect(settingsSchema.safeParse(DEFAULT_SETTINGS).success).toBe(true);
  });

  it("rejects an unknown template id", () => {
    expect(
      settingsSchema.safeParse({ ...DEFAULT_SETTINGS, templateId: "fancy" })
        .success,
    ).toBe(false);
  });
});
