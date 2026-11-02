import {
  LOCATION_PART_KEYS,
  LOCATION_PART_SEPARATOR,
} from "#/features/resume/constants";
import type { Location } from "#/features/resume/resume-schema";

export function formatLocation(location: Location): string {
  return LOCATION_PART_KEYS.map((key) => location[key]?.trim() ?? "")
    .filter((part) => part !== "")
    .join(LOCATION_PART_SEPARATOR);
}
