import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DSASheet, DetailedProblem } from "@/types/dsa-sheet";

type ProblemReference = {
  problem_id?: string;
  slug?: string;
  title?: string;
  difficulty?: string;
  platform?: string;
  problem_url?: string;
};

export const generateSheetPDF = (sheet: DSASheet, sheetProblems: DetailedProblem[]) => {
  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Colors
  const brandColor: [number, number, number] = [139, 92, 246]; // Violet 500
  const darkColor: [number, number, number] = [17, 24, 39]; // Gray 900
  const lightColor: [number, number, number] = [107, 114, 128]; // Gray 500

  // --- Title Page ---
  
  // Header background graphic elements
  doc.setFillColor(...brandColor);
  doc.rect(0, 0, pageWidth, 280, "F");
  
  // Add some "abstract" shapes
  doc.setFillColor(167, 139, 250); // lighter purple
  doc.circle(pageWidth, 0, 150, "F");
  doc.setFillColor(109, 40, 217); // darker purple
  doc.circle(0, 280, 80, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  const titleLines = doc.splitTextToSize(sheet.title || "DSA Learning Sheet", pageWidth - 80);
  doc.text(titleLines, pageWidth / 2, 100, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "italic");
  doc.setFontSize(14);
  doc.text("Official Tracking Sheet", pageWidth / 2, 100 + titleLines.length * 36, { align: "center" });

  // Description
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  const descLines = doc.splitTextToSize(
    sheet.description || "A structured roadmap guiding you step-by-step through essential DSA patterns.",
    pageWidth - 100
  );
  doc.text(descLines, pageWidth / 2, 100 + titleLines.length * 36 + 30, { align: "center" });

  // Metadata block (Card)
  const yPos = 340;
  
  doc.setDrawColor(229, 231, 235); // Gray 200
  doc.setFillColor(249, 250, 251); // Gray 50
  doc.roundedRect(60, yPos, pageWidth - 120, 160, 8, 8, "FD");

  doc.setTextColor(...darkColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Sheet Overview", pageWidth / 2, yPos + 35, { align: "center" });
  
  // Line separator
  doc.setDrawColor(229, 231, 235);
  doc.line(100, yPos + 50, pageWidth - 100, yPos + 50);
  
  const totalTopics = sheet.sheet_json?.topics?.length || 0;
  let totalProblems = 0;
  sheet.sheet_json?.topics?.forEach((t) => {
    t.steps?.forEach((s) => {
      totalProblems += s.problems?.length || 0;
    });
  });

  const col1X = 100;
  const col2X = pageWidth / 2 + 20;
  let detailY = yPos + 80;

  doc.setFontSize(12);
  doc.setTextColor(...darkColor);
  
  doc.setFont("helvetica", "bold");
  doc.text("Level:", col1X, detailY);
  doc.setFont("helvetica", "normal");
  doc.text(sheet.level || "Beginner to Advanced", col1X + 45, detailY);

  doc.setFont("helvetica", "bold");
  doc.text("Total Topics:", col2X, detailY);
  doc.setFont("helvetica", "normal");
  doc.text(`${totalTopics}`, col2X + 80, detailY);

  detailY += 30;
  doc.setFont("helvetica", "bold");
  doc.text("Total Problems:", col1X, detailY);
  doc.setFont("helvetica", "normal");
  doc.text(`${totalProblems}`, col1X + 100, detailY);

  if (sheet.estimated_hours) {
    doc.setFont("helvetica", "bold");
    doc.text("Est. Duration:", col2X, detailY);
    doc.setFont("helvetica", "normal");
    doc.text(`~${sheet.estimated_hours} Hours`, col2X + 90, detailY);
  } else {
    doc.setFont("helvetica", "bold");
    doc.text("Format:", col2X, detailY);
    doc.setFont("helvetica", "normal");
    doc.text("Self Paced", col2X + 60, detailY);
  }

  // Footer / Branding
  doc.setTextColor(...brandColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("CrackDSA", pageWidth / 2, pageHeight - 80, { align: "center" });
  doc.setTextColor(...lightColor);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Master Data Structures & Algorithms", pageWidth / 2, pageHeight - 60, { align: "center" });
  doc.text("www.crackdsa.com", pageWidth / 2, pageHeight - 45, { align: "center" });

  // --- Content Pages ---
  
  if (sheet.sheet_json?.topics) {
    sheet.sheet_json.topics.forEach((topic, topicIndex) => {
      doc.addPage();
      
      // Topic Header
      doc.setTextColor(...darkColor);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(`${topicIndex + 1}. ${topic.title}`, 40, 60);
      
      let startY = 80;

      topic.steps?.forEach((step, stepIndex) => {
        // Step Header
        doc.setTextColor(...brandColor);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        
        // Ensure there is enough space for step header + table header
        if (startY > pageHeight - 100) {
          doc.addPage();
          startY = 60;
        }

        const patternName = step.pattern_id
          ? ` (${step.pattern_id.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")})`
          : "";
          
        doc.text(`Step ${stepIndex + 1}: ${step.title}${patternName}`, 40, startY);
        startY += 15;

        // Prepare table data
        const tableBody = step.problems.map((prob) => {
          const detailed = sheetProblems.find((p) => p.slug === prob.problem_id);
          const pData: ProblemReference = detailed || prob;
          
          const title = pData.title || (pData.problem_id || pData.slug || "").split(/[-_]/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          const diff = pData.difficulty || "Medium";
          const platform = pData.platform || "Internal";
          const link = pData.problem_url || `https://crackdsa.com/problem/${pData.slug || pData.problem_id}`;

          return ["", title, diff, platform, link];
        });

        // Draw table
        autoTable(doc, {
          startY: startY,
          head: [["Status", "Problem", "Difficulty", "Platform", "Link"]],
          body: tableBody,
          theme: "striped",
          headStyles: {
            fillColor: brandColor,
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          columnStyles: {
            0: { cellWidth: 45, halign: "center" }, // Status checkbox
            1: { cellWidth: 160 },
            2: { cellWidth: 70 },
            3: { cellWidth: 70 },
            4: { cellWidth: "auto", textColor: [59, 130, 246] }, // Blue links
          },
          margin: { left: 40, right: 40 },
          didParseCell: function (data) {
            // Make links clickable if it's the link column (index 4) and in body
            if (data.section === "body" && data.column.index === 4) {
              const url = data.cell.raw as string;
              if (url && url.startsWith("http")) {
                data.cell.text = ["Solve \u2192", url]; // Show arrow text and the full URL below it
                data.cell.styles.fontSize = 8; // Make font smaller to accommodate the URL length
              }
            }
          },
          didDrawCell: function (data) {
            // Draw checkbox
            if (data.section === "body" && data.column.index === 0) {
              doc.setDrawColor(200, 200, 200);
              doc.setFillColor(255, 255, 255);
              doc.setLineWidth(1);
              // Center the checkbox in the cell
              const size = 12;
              const x = data.cell.x + (data.cell.width - size) / 2;
              const y = data.cell.y + (data.cell.height - size) / 2;
              doc.roundedRect(x, y, size, size, 2, 2, "FD");
            }

            // Link
            if (data.section === "body" && data.column.index === 4) {
              const rowData = data.row.raw as string[];
              const url = rowData[4] as string;
              if (url && url.startsWith("http")) {
                doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url });
              }
            }
          },
        });

        startY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 30;
      });
    });
  }

  // Save the PDF
  doc.save(`${sheet.title.replace(/\s+/g, "_").toLowerCase()}_crackdsa.pdf`);
};
