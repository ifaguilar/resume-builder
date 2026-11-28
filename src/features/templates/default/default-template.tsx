import { Document, Page, Text, View } from "@react-pdf/renderer";

import { documentWord } from "#/features/languages/cv-language";
import type { Resume } from "#/features/resume/resume-schema";
import type { PageSize, Settings } from "#/features/resume/settings-schema";
import {
  DOCUMENT_TITLE_SEPARATOR,
  LABEL_SUFFIX,
} from "#/features/templates/constants";
import { withContentKeys } from "#/features/templates/content-keys";
import { BODY_LEADING } from "#/features/templates/design-tokens";
import { PDF_FONT_FEATURES } from "#/features/templates/fonts/constants";
import {
  Bullet,
  BulletList,
} from "#/features/templates/primitives/bullet-list";
import { Entry } from "#/features/templates/primitives/entry";
import { Link } from "#/features/templates/primitives/link";
import { Section } from "#/features/templates/primitives/section";
import {
  type LabeledItem as LabeledItemContent,
  type LinkedText,
  type ResumeHeader,
  type ResumeSection,
  resumeContent,
} from "#/features/templates/resume-content";
import { TemplateTheme, useTw } from "#/features/templates/template-theme";

// Letter is 50 pt shorter than A4, so it gets tighter margins and section
// gaps to keep a one-page CV on one page.
const PAGE_LAYOUTS = {
  A4: { page: "p-14", sectionGap: "mt-5" },
  LETTER: { page: "px-14 py-10", sectionGap: "mt-3" },
} satisfies Record<PageSize, { page: string; sectionGap: string }>;

function LabeledItem({ label, value }: LabeledItemContent) {
  const tw = useTw();
  return (
    <Bullet>
      {label && (
        <Text style={tw("font-semibold")}>
          {value ? label + LABEL_SUFFIX : label}
        </Text>
      )}
      {value && <Text style={tw("text-muted")}>{value}</Text>}
    </Bullet>
  );
}

function Contact({ contact }: { contact: LinkedText }) {
  return contact.href ? (
    <Link href={contact.href}>{contact.text}</Link>
  ) : (
    <Text>{contact.text}</Text>
  );
}

function Aside({ aside }: { aside: LinkedText }) {
  const tw = useTw();
  return aside.href ? (
    <Link href={aside.href}>{aside.text}</Link>
  ) : (
    <Text style={tw("text-muted")}>{aside.text}</Text>
  );
}

function Header({ header }: { header: ResumeHeader }) {
  const tw = useTw();
  return (
    <View>
      {header.name ? (
        <Text style={tw("text-xl leading-normal font-bold")}>
          {header.name}
        </Text>
      ) : null}
      {header.label ? (
        <Text style={tw("text-sm leading-normal")}>{header.label}</Text>
      ) : null}
      {header.contacts.length > 0 ? (
        <View style={tw("mt-2.5 flex-row flex-wrap gap-x-7 text-muted")}>
          {withContentKeys(header.contacts).map(({ key, item }) => (
            <Contact key={key} contact={item} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function SectionBody({ section }: { section: ResumeSection }) {
  const tw = useTw();
  switch (section.id) {
    case "summary":
      return <Text>{section.text}</Text>;
    case "skills":
      return (
        <BulletList>
          {withContentKeys(section.items).map(({ key, item }) => (
            <LabeledItem key={key} {...item} />
          ))}
        </BulletList>
      );
    default:
      return (
        <View style={tw("gap-3.5")}>
          {withContentKeys(section.entries).map(({ key, item: entry }) => (
            <Entry
              key={key}
              title={entry.title}
              date={entry.date}
              subtitle={entry.subtitle}
              aside={entry.aside ? <Aside aside={entry.aside} /> : null}
              highlights={entry.highlights}
            />
          ))}
        </View>
      );
  }
}

type TemplateProps = { resume: Resume; settings: Settings };

export function DefaultTemplate(props: TemplateProps) {
  return (
    <TemplateTheme settings={props.settings}>
      <DefaultDocument {...props} />
    </TemplateTheme>
  );
}

function DefaultDocument({ resume, settings }: TemplateProps) {
  const tw = useTw();
  const layout = PAGE_LAYOUTS[settings.pageSize];
  const content = resumeContent(resume, settings);
  const { name } = content.header;
  const word = documentWord(content.language, settings.pageSize);

  return (
    <Document
      title={name ? name + DOCUMENT_TITLE_SEPARATOR + word : undefined}
      author={name || undefined}
      language={content.language}
    >
      <Page
        size={settings.pageSize}
        style={[
          tw(
            `${layout.page} font-sans text-xs ${BODY_LEADING} text-foreground`,
          ),
          { fontFeatureSettings: PDF_FONT_FEATURES },
        ]}
      >
        <Header header={content.header} />
        {content.sections.map((section) => (
          <Section
            key={section.id}
            title={section.title}
            topMargin={layout.sectionGap}
          >
            <SectionBody section={section} />
          </Section>
        ))}
      </Page>
    </Document>
  );
}
