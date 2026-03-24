import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportDecisionToPDF(decision) {
  try {
    const doc = new jsPDF();
    const accentColor = [91, 141, 239]; // #5b8def

    // ── Header ──────────────────────────────────
    doc.setFillColor(...accentColor);
    doc.rect(0, 0, 220, 28, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text('Bunker Decision', 14, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(220, 235, 255);
    const dateLabel = decision.decidedAt
      ? `Decided: ${formatDate(decision.decidedAt)}`
      : `Created: ${formatDate(decision.createdAt)}`;
    doc.text(dateLabel, 14, 20);

    const statusText = decision.status === 'decided' ? 'DECIDED' : 'ACTIVE';
    const statusColor = decision.status === 'decided' ? [48, 164, 108] : accentColor;
    doc.setFillColor(...statusColor);
    const statusWidth = doc.getTextWidth(statusText) + 10;
    doc.roundedRect(200 - statusWidth, 8, statusWidth, 8, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(statusText, 200 - statusWidth + 5, 13.5);

    let y = 40;

    // ── Title ───────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(30, 30, 30);
    const titleLines = doc.splitTextToSize(decision.title || 'Untitled Decision', 180);
    doc.text(titleLines, 14, y);
    y += titleLines.length * 7 + 6;

    // ── The Problem ─────────────────────────────
    if (decision.problem) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text('THE PROBLEM', 14, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      const problemLines = doc.splitTextToSize(decision.problem, 180);
      doc.text(problemLines, 14, y);
      y += problemLines.length * 5 + 10;
    }

    // ── Options ─────────────────────────────────
    if (decision.options && decision.options.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text('OPTIONS & ANALYSIS', 14, y);
      y += 5;

      const tableData = decision.options.map((opt, idx) => {
        const isChosen = decision.status === 'decided' && decision.chosenOption === idx;
        return [
          isChosen ? `✓ ${opt.name}` : opt.name || `Option ${idx + 1}`,
          opt.sixMonths || '—',
          opt.worst || '—',
          opt.best || '—',
        ];
      });

      autoTable(doc, {
        startY: y,
        head: [['Option', '6 months / 2 years', 'Worst case', 'Best case']],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: accentColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
        },
        bodyStyles: { fontSize: 9, textColor: [60, 60, 60] },
        columnStyles: {
          0: { cellWidth: 40, fontStyle: 'bold' },
          1: { cellWidth: 45 },
          2: { cellWidth: 45 },
          3: { cellWidth: 45 },
        },
        margin: { left: 14, right: 14 },
        styles: { lineColor: [220, 220, 220], lineWidth: 0.3 },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      y = doc.lastAutoTable.finalY + 12;
    }

    // ── Tradeoffs ───────────────────────────────
    if (decision.tradeoffs) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text('TRADEOFFS', 14, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      const tradeLines = doc.splitTextToSize(decision.tradeoffs, 180);
      doc.text(tradeLines, 14, y);
      y += tradeLines.length * 5 + 10;
    }

    // ── Deadline ────────────────────────────────
    if (decision.deadline) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text('DEADLINE', 14, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      const dlStatus = deadlineStatusLabel(decision.deadline);
      const dlColor = dlStatus.includes('overdue') ? [229, 72, 77] : dlStatus.includes('today') ? [245, 166, 35] : [60, 60, 60];
      doc.setTextColor(...dlColor);
      doc.text(`${formatDate(decision.deadline)} — ${dlStatus}`, 14, y);
      y += 10;
    }

    // ── Regret Check ─────────────────────────────
    if (decision.regretAnswer) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text('REGRET CHECK', 14, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      const regretLines = doc.splitTextToSize(decision.regretAnswer, 180);
      doc.text(regretLines, 14, y);
      y += regretLines.length * 5 + 10;
    }

    // ── Outcome ──────────────────────────────────
    if (decision.status === 'decided') {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFillColor(48, 164, 108);
      doc.roundedRect(14, y - 2, 180, 24, 3, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      const chosenOpt = decision.options?.[decision.chosenOption];
      doc.text(`Chose: ${chosenOpt?.name || 'Unknown option'}`, 18, y + 6);

      if (decision.decisionWhy) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(220, 255, 235);
        const whyLines = doc.splitTextToSize(decision.decisionWhy, 170);
        doc.text(whyLines.slice(0, 2).join(' '), 18, y + 13);
      }

      y += 30;

      if (decision.wouldChooseAgain !== null) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text(
          `Would choose again: ${decision.wouldChooseAgain ? 'Yes' : 'Not sure / would reconsider'}`,
          14, y
        );
        y += 8;
      }

      if (decision.outcome) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        const outcomeColor = decision.outcome === 'good' ? [48, 164, 108] : decision.outcome === 'bad' ? [229, 72, 77] : [150, 150, 150];
        doc.setTextColor(...outcomeColor);
        doc.text(`Outcome: ${decision.outcome.toUpperCase()}`, 14, y);
        y += 8;
      }
    }

    // ── Footer ───────────────────────────────────
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.text(`Generated by Bunker — Page ${i} of ${pageCount}`, 14, 290);
    }

    const safeName = (decision.title || 'decision').replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 40);
    doc.save(`bunker-${safeName}.pdf`);
    return { success: true };
  } catch (err) {
    console.error('PDF export failed:', err);
    return { success: false, error: err.message || 'Export failed' };
  }
}

function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function deadlineStatusLabel(isoDate) {
  if (!isoDate) return '';
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const deadline = new Date(isoDate);
  deadline.setHours(0, 0, 0, 0);
  const diff = deadline - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}
