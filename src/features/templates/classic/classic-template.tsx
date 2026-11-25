import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { Resume } from "#/features/resume/resume-schema";
import type { PageSize, Settings } from "#/features/resume/settings-schema";
import {
  DEGREE_AREA_JOINER,
  DOCUMENT_LANGUAGE,
  DOCUMENT_TITLE_SUFFIX,
  LABEL_SUFFIX,
  LANGUAGES_LABEL,
  LIST_SEPARATOR,
  MAILTO_PREFIX,
  SECTION_TITLES,
  TEL_PREFIX,
} from "#/features/templates/constants";
import { withContentKeys } from "#/features/templates/content-keys";
import { BODY_LEADING, tw } from "#/features/templates/design-tokens";
import { PDF_FONT_FEATURES } from "#/features/templates/fonts/constants";
import {
  cleanList,
  cleanText,
  displayUrl,
  formatDateRange,
  formatList,
  formatPlace,
  formatYear,
} from "#/features/templates/format";
import {
  Bullet,
  BulletList,
} from "#/features/templates/primitives/bullet-list";
import { Entry } from "#/features/templates/primitives/entry";
import { Link } from "#/features/templates/primitives/link";
import { Section } from "#/features/templates/primitives/section";

const PHONE_LINK_JUNK = /[^\d+]/g;

// Letter is 50 pt shorter than A4, so it gets tighter margins and section
// gaps to keep a one-page CV on one page.
const PAGE_LAYOUTS = {
  A4: { page: "p-14", sectionGap: "mt-5" },
  LETTER: { page: "px-14 py-10", sectionGap: "mt-3" },
} satisfies Record<PageSize, { page: string; sectionGap: string }>;

type SectionProps = { resume: Resume; sectionGap: string };

function LabeledItem({ label, value }: { label: string; value: string }) {
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

function Header({ resume }: { resume: Resume }) {
  const basics = resume.basics ?? {};
  const name = cleanText(basics.name);
  const label = cleanText(basics.label);
  const place = formatPlace(basics.location);
  const phone = cleanText(basics.phone);
  const email = cleanText(basics.email);
  const website = cleanText(basics.url);
  const profileUrls = (basics.profiles ?? [])
    .map((profile) => cleanText(profile.url))
    .filter((url) => url !== "");
  const hasContact =
    place || phone || email || website || profileUrls.length > 0;

  return (
    <View>
      {name ? (
        <Text style={tw("text-xl leading-normal font-bold")}>{name}</Text>
      ) : null}
      {label ? <Text style={tw("text-sm leading-normal")}>{label}</Text> : null}
      {hasContact ? (
        <View style={tw("mt-2.5 flex-row flex-wrap gap-x-7 text-muted")}>
          {place ? <Text>{place}</Text> : null}
          {phone ? (
            <Link href={TEL_PREFIX + phone.replace(PHONE_LINK_JUNK, "")}>
              {phone}
            </Link>
          ) : null}
          {email ? <Link href={MAILTO_PREFIX + email}>{email}</Link> : null}
          {website ? <Link href={website}>{displayUrl(website)}</Link> : null}
          {withContentKeys(profileUrls).map(({ key, item: url }) => (
            <Link key={key} href={url}>
              {displayUrl(url)}
            </Link>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function SkillsSection({ resume, sectionGap }: SectionProps) {
  const groups = (resume.skills ?? [])
    .map((skill) => ({
      label: cleanText(skill.name),
      value: formatList(skill.keywords),
    }))
    .filter((group) => group.label || group.value);
  const languages = (resume.languages ?? [])
    .map((entry) => {
      const language = cleanText(entry.language);
      const fluency = cleanText(entry.fluency);
      return language && fluency ? `${language} (${fluency})` : language;
    })
    .filter((language) => language !== "")
    .join(LIST_SEPARATOR);
  if (groups.length === 0 && !languages) return null;

  return (
    <Section title={SECTION_TITLES.skills} topMargin={sectionGap}>
      <BulletList>
        {withContentKeys(groups).map(({ key, item: group }) => (
          <LabeledItem key={key} label={group.label} value={group.value} />
        ))}
        {languages ? (
          <LabeledItem label={LANGUAGES_LABEL} value={languages} />
        ) : null}
      </BulletList>
    </Section>
  );
}

function ExperienceSection({ resume, sectionGap }: SectionProps) {
  const entries = (resume.work ?? []).map((work) => ({
    title: cleanText(work.position),
    date: formatDateRange(work.startDate, work.endDate),
    subtitle: cleanText(work.name),
    place: formatPlace(work.location),
    highlights: cleanList(work.highlights),
  }));
  const filled = entries.filter(
    (entry) =>
      entry.title ||
      entry.date ||
      entry.subtitle ||
      entry.place ||
      entry.highlights.length > 0,
  );
  if (filled.length === 0) return null;

  return (
    <Section title={SECTION_TITLES.experience} topMargin={sectionGap}>
      <View style={tw("gap-3.5")}>
        {withContentKeys(filled).map(({ key, item: entry }) => (
          <Entry
            key={key}
            title={entry.title}
            date={entry.date}
            subtitle={entry.subtitle}
            aside={
              entry.place ? (
                <Text style={tw("text-muted")}>{entry.place}</Text>
              ) : null
            }
            highlights={entry.highlights}
          />
        ))}
      </View>
    </Section>
  );
}

function ProjectsSection({ resume, sectionGap }: SectionProps) {
  const entries = (resume.projects ?? [])
    .map((project) => ({
      title: cleanText(project.name),
      date: formatDateRange(project.startDate, project.endDate),
      subtitle: cleanText(project.description),
      url: cleanText(project.url),
      highlights: cleanList(project.highlights),
    }))
    .filter(
      (entry) =>
        entry.title ||
        entry.date ||
        entry.subtitle ||
        entry.url ||
        entry.highlights.length > 0,
    );
  if (entries.length === 0) return null;

  return (
    <Section title={SECTION_TITLES.projects} topMargin={sectionGap}>
      <View style={tw("gap-3.5")}>
        {withContentKeys(entries).map(({ key, item: entry }) => (
          <Entry
            key={key}
            title={entry.title}
            date={entry.date}
            subtitle={entry.subtitle}
            aside={
              entry.url ? (
                <Link href={entry.url}>{displayUrl(entry.url)}</Link>
              ) : null
            }
            highlights={entry.highlights}
          />
        ))}
      </View>
    </Section>
  );
}

function EducationSection({ resume, sectionGap }: SectionProps) {
  const entries = (resume.education ?? [])
    .map((education) => ({
      title: [cleanText(education.studyType), cleanText(education.area)]
        .filter((part) => part !== "")
        .join(DEGREE_AREA_JOINER),
      date: formatYear(education.endDate),
      subtitle: cleanText(education.institution),
    }))
    .filter((entry) => entry.title || entry.date || entry.subtitle);
  if (entries.length === 0) return null;

  return (
    <Section title={SECTION_TITLES.education} topMargin={sectionGap}>
      <View style={tw("gap-3.5")}>
        {withContentKeys(entries).map(({ key, item: entry }) => (
          <Entry key={key} {...entry} />
        ))}
      </View>
    </Section>
  );
}

export function ClassicTemplate({
  resume,
  settings,
}: {
  resume: Resume;
  settings: Settings;
}) {
  const layout = PAGE_LAYOUTS[settings.pageSize];
  const name = cleanText(resume.basics?.name);
  const summary = cleanText(resume.basics?.summary);

  return (
    <Document
      title={name ? name + DOCUMENT_TITLE_SUFFIX : undefined}
      author={name || undefined}
      language={DOCUMENT_LANGUAGE}
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
        <Header resume={resume} />
        {summary ? (
          <Section title={SECTION_TITLES.summary} topMargin={layout.sectionGap}>
            <Text>{summary}</Text>
          </Section>
        ) : null}
        <SkillsSection resume={resume} sectionGap={layout.sectionGap} />
        <ExperienceSection resume={resume} sectionGap={layout.sectionGap} />
        <ProjectsSection resume={resume} sectionGap={layout.sectionGap} />
        <EducationSection resume={resume} sectionGap={layout.sectionGap} />
      </Page>
    </Document>
  );
}
