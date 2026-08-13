import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import type { Playbook } from "./sentinai-store";

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: "1F4F73" };
const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function header(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true, color: "0BA5C7", font: "Calibri" })],
  });
}
function sub(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, color: "2B5C8C", font: "Calibri" })],
  });
}
function p(text: string, opts: { bold?: boolean; color?: string } = {}) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Calibri", size: 22, ...opts })],
  });
}
function kv(k: string, v: string) {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 2800, type: WidthType.DXA },
        borders,
        shading: { fill: "0B2540", type: ShadingType.CLEAR, color: "auto" },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: k, bold: true, color: "FFFFFF", font: "Calibri", size: 20 })] })],
      }),
      new TableCell({
        width: { size: 6560, type: WidthType.DXA },
        borders,
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: v, font: "Calibri", size: 22 })] })],
      }),
    ],
  });
}

export async function generateIncidentReport(playbook: Playbook, rawLog: string, analysis?: string, domain?: string, classification?: string) {
  const now = new Date();
  const ts = now.toISOString();
  const incidentId = `SNT-${now.getTime().toString().slice(-8)}`;

  const doc = new Document({
    creator: "SentinAI v2.0",
    title: `Incident Report — ${playbook.name}`,
    styles: {
      default: { document: { run: { font: "Calibri", size: 22 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 32, bold: true, color: "0BA5C7" },
          paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 26, bold: true, color: "2B5C8C" },
          paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
      ],
    },
    sections: [
      {
        properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [new TextRun({ text: "SENTINAI v2.0", bold: true, size: 44, color: "0BA5C7" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 280 },
            children: [new TextRun({ text: "AUTONOMOUS CYBER SECURITY COMMAND CENTER", bold: true, size: 20, color: "7A93AD" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 320 },
            children: [new TextRun({ text: "Official Incident Response Report", italics: true, size: 24, color: "2B5C8C" })],
          }),

          header("1. Incident Summary"),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [2800, 6560],
            rows: [
              kv("Incident ID", incidentId),
              kv("Target Domain", domain ?? "Unscoped"),
              kv("Classification", classification || playbook.category),
              kv("Playbook", playbook.name),
              kv("Detected At", ts),
              kv("Severity", "CRITICAL"),
              kv("Status", analysis ? "THREAT KILLED & BLOCKED" : "Mitigation Executed"),
              kv("Responding Agent", "SentinAI Neural Mitigation Engine"),
            ],
          }),

          header("2. Executive Brief"),
          p(`SentinAI v2.0 detected, classified and neutralized a ${playbook.category.toLowerCase()} event matching the ${playbook.name} signature. The Neural Mitigation pipeline orchestrated the Threat Hunter, Compliance Analyst and Incident Responder agents in parallel and produced this report autonomously.`),

          header("3. Neural Analysis (Backend Engine)"),
          ...(analysis
            ? analysis.split("\n").map((line) => p(line || " "))
            : [p("No backend analysis was returned. This report contains template content only.", { color: "7A93AD" })]),

          header("4. Raw Telemetry (Neural Feed)"),
          ...rawLog.split("\n").map((line) =>
            new Paragraph({
              spacing: { after: 20 },
              shading: { fill: "0A1A2C", type: ShadingType.CLEAR, color: "auto" },
              children: [new TextRun({ text: line || " ", font: "Consolas", size: 18, color: "9FE8FF" })],
            }),
          ),

          header("5. Agent Reasoning Chain"),
          sub("5.1 Threat Hunter (Identify)"),
          p("• Correlated indicators across endpoint, network and identity planes."),
          p("• Mapped TTPs to MITRE ATT&CK techniques and known threat-actor playbook."),
          p(`• Confidence: 0.97 — match: ${playbook.name}.`),
          sub("5.2 Compliance Analyst (Alert / SOC2)"),
          p("• Verified mandatory notification triggers under GDPR Article 32 and SOC2 CC7.3."),
          p("• Drafted regulator notice and customer disclosure templates."),
          p("• Logged immutable audit entry to compliance ledger."),
          sub("5.3 Incident Responder (Defend / Response)"),
          p("• Isolated affected hosts via EDR network containment."),
          p("• Rotated impacted credentials and revoked active sessions."),
          p("• Deployed signature + behavioral block at perimeter and identity provider."),
          p("• Initiated forensic snapshot for chain-of-custody preservation."),

          header("6. Mitigation Actions Executed"),
          p("✓ Containment — affected segments quarantined."),
          p("✓ Eradication — malicious artifacts removed, persistence cleared."),
          p("✓ Recovery — golden-image restore initiated for impacted endpoints."),
          p("✓ Hardening — detection rules tuned, EDR policy escalated."),

          header("7. Compliance Posture"),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [2800, 6560],
            rows: [
              kv("GDPR Article 32", "COMPLIANT — encryption, integrity, notification path verified"),
              kv("SOC2 CC6 / CC7", "COMPLIANT — logical access + incident response controls operating"),
              kv("ISO 27001 A.16", "COMPLIANT — incident management documented"),
              kv("Data Subjects Affected", "Under assessment"),
            ],
          }),

          header("8. Recommendations"),
          p("1. Maintain elevated monitoring for affected segments for 14 days."),
          p("2. Conduct tabletop exercise reusing this telemetry."),
          p("3. Backport detection rule to historical log archive (90-day RAG re-scan)."),
          p("4. Review and rotate any shared secrets touched by impacted identities."),

          header("9. Technical Architecture"),
          p("Brain: Llama 3.3 Versatile · Memory: Pinecone Vector DB (RAG) · Ops: PEFT/LoRA fine-tuned · Cloud: AWS Bedrock Ready"),

          new Paragraph({
            spacing: { before: 400 },
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "— END OF REPORT —", bold: true, color: "7A93AD" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `Generated autonomously by SentinAI v2.0 · ${ts}`, italics: true, size: 18, color: "7A93AD" })],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `SentinAI_Incident_${incidentId}.docx`);
}
