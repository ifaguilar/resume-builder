import { cn } from "cn";
import { type ReactNode, use, useId } from "react";

import { SectionTitleInput } from "#/features/design/components/section-title-input";
import { SECTION_NAMES } from "#/features/design/constants";
import {
  moveSection,
  sectionSetting,
  sectionTitleSetting,
  updateSection,
} from "#/features/design/section-settings";
import type { CvSectionId } from "#/features/resume/constants";
import type { SectionSetting } from "#/features/resume/settings-schema";
import { m } from "#/paraglide/messages.js";
import { AnnounceContext } from "#/shared/components/announce-context";
import { ReorderMenu } from "#/shared/components/reorder-menu";
import { SortableItemContext } from "#/shared/components/sortable-item-context";
import { SortableItem, SortableList } from "#/shared/components/sortable-list";
import { Checkbox } from "#/shared/components/ui/checkbox";
import { FieldDescription } from "#/shared/components/ui/field";
import { Label } from "#/shared/components/ui/label";

type SectionRowProps = {
  section: SectionSetting;
  defaultTitle: string;
  grip: ReactNode;
  onChange: (change: (section: SectionSetting) => SectionSetting) => void;
};

function SectionRow({
  section,
  defaultTitle,
  grip,
  onChange,
}: SectionRowProps) {
  const item = use(SortableItemContext);
  const id = useId();
  const name = SECTION_NAMES[section.id]();

  return (
    <div
      ref={item?.ref}
      // dnd-kit leaves a hidden copy of the row where it will land; these
      // styles turn it into a drop slot, as entry cards do.
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-lg border bg-background py-1.5 pr-2 pl-1 data-dnd-placeholder:visible! data-dnd-placeholder:border-transparent data-dnd-placeholder:bg-primary/5 data-dnd-placeholder:outline-2 data-dnd-placeholder:-outline-offset-2 data-dnd-placeholder:outline-primary/50 data-dnd-placeholder:outline-dashed data-dnd-placeholder:*:invisible",
        item?.isDragging && "relative z-10 shadow-xl ring-2 ring-primary/30",
      )}
    >
      {grip}
      <Checkbox
        id={id}
        checked={section.visible}
        aria-label={m.design_show_section({ name })}
        onCheckedChange={(visible) =>
          onChange((current) =>
            sectionSetting(current.id, visible, current.title),
          )
        }
      />
      <Label
        htmlFor={id}
        className={cn(
          "min-w-0 flex-1 truncate @md/form:w-24 @md/form:flex-none",
          !section.visible && "text-muted-foreground",
        )}
      >
        {name}
      </Label>
      <SectionTitleInput
        value={section.title}
        placeholder={defaultTitle}
        label={m.design_section_title_label({ name })}
        onCommit={(text) =>
          onChange((current) =>
            sectionSetting(
              current.id,
              current.visible,
              sectionTitleSetting(text, defaultTitle),
            ),
          )
        }
      />
    </div>
  );
}

export function SectionsField({
  sections,
  defaultTitles,
  onChange,
}: {
  sections: SectionSetting[];
  defaultTitles: Record<CvSectionId, string>;
  onChange: (change: (sections: SectionSetting[]) => SectionSetting[]) => void;
}) {
  const announce = use(AnnounceContext);
  const [fixed, ...movable] = sections;

  function change(id: CvSectionId) {
    return (update: (section: SectionSetting) => SectionSetting) =>
      onChange((current) => updateSection(current, id, update));
  }

  function move(from: number, to: number) {
    const section = movable[from];
    if (section === undefined) return;
    onChange((current) => moveSection(current, from, to));
    announce(
      m.design_section_moved({
        name: SECTION_NAMES[section.id](),
        position: to + 1,
        count: movable.length,
      }),
    );
  }

  return (
    <>
      <FieldDescription>{m.design_sections_tip()}</FieldDescription>
      <div className="flex flex-col gap-2">
        {fixed === undefined ? null : (
          <SectionRow
            section={fixed}
            defaultTitle={defaultTitles[fixed.id]}
            // Keeps the fixed row's checkbox in line with the others.
            grip={<span aria-hidden className="size-8 shrink-0" />}
            onChange={change(fixed.id)}
          />
        )}
        <SortableList onMove={move}>
          {movable.map((section, index) => (
            <SortableItem
              key={section.id}
              id={section.id}
              index={index}
              count={movable.length}
              onMove={move}
            >
              <SectionRow
                section={section}
                defaultTitle={defaultTitles[section.id]}
                grip={
                  <ReorderMenu
                    label={m.design_reorder_section({
                      name: SECTION_NAMES[section.id](),
                    })}
                  />
                }
                onChange={change(section.id)}
              />
            </SortableItem>
          ))}
        </SortableList>
      </div>
    </>
  );
}
