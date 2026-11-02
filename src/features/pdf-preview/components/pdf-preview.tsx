import {
  Document,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
} from "@react-pdf/renderer";

import {
  PREVIEW_FONT_SIZE_PT,
  PREVIEW_PAGE_PADDING_PT,
  PREVIEW_PAGE_SIZE,
} from "#/features/pdf-preview/constants";

const styles = StyleSheet.create({
  page: { padding: PREVIEW_PAGE_PADDING_PT },
  text: { fontSize: PREVIEW_FONT_SIZE_PT },
});

// Loaded only through React.lazy in preview-panel.tsx, so react-pdf never
// runs on the server and stays out of the main bundle.
export default function PdfPreview() {
  return (
    <PDFViewer width="100%" height="100%" showToolbar className="border-0">
      <Document title="Resume preview">
        <Page size={PREVIEW_PAGE_SIZE} style={styles.page}>
          <Text style={styles.text}>Your resume preview will appear here.</Text>
        </Page>
      </Document>
    </PDFViewer>
  );
}
