/* ============================================
   BUNKER — Export Utilities
   Calendar (ICS), Notion, Slack, Share Link
   ============================================ */

/**
 * Generate an ICS (iCalendar) file for a decision deadline
 */
export function generateICS(decision) {
  const { title, problem, deadline, options = [] } = decision;
  if (!deadline) return null;

  const deadlineDate = new Date(deadline);
  // Format: YYYYMMDDTHHmmssZ
  const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bunker//Decision Deadline//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(deadlineDate)}`,
    `DTEND:${fmt(new Date(deadlineDate.getTime() + 60 * 60 * 1000))}`,
    `SUMMARY:⏰ Decision Due: ${escapeICS(title)}`,
    `DESCRIPTION:${escapeICS(buildDescription(decision))}`,
    `UID:${decision.id}@bunker.app`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Your decision "${escapeICS(title)}" is due tomorrow!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

function escapeICS(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

function buildDescription(decision) {
  const parts = [];
  if (decision.problem) parts.push(`Problem: ${decision.problem}`);
  if (decision.options?.length) {
    decision.options.forEach((opt, i) => {
      parts.push(`Option ${i + 1}: ${opt.name}`);
      if (opt.best) parts.push(`  Best case: ${opt.best}`);
      if (opt.worst) parts.push(`  Worst case: ${opt.worst}`);
    });
  }
  return parts.join('\\n');
}

/**
 * Trigger a calendar file download
 */
export function exportToCalendar(decision) {
  const ics = generateICS(decision);
  if (!ics) return { success: false, error: 'No deadline set' };

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bunker-${(decision.title || 'decision').toLowerCase().replace(/\s+/g, '-')}-deadline.ics`;
  a.click();
  URL.revokeObjectURL(url);
  return { success: true };
}

/**
 * Build a Google Calendar URL for the deadline
 */
export function buildGoogleCalendarUrl(decision) {
  const { title, problem, deadline } = decision;
  if (!deadline) return null;

  const startDate = new Date(deadline);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const text = encodeURIComponent(title);
  const details = encodeURIComponent(buildDescription(decision));

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${fmt(startDate)}/${fmt(endDate)}&details=${details}&recur=NEVER`;
}

/**
 * Generate a shareable read-only link (encodes decision as base64 in URL hash)
 */
export function generateShareLink(decision) {
  const pub = {
    t: decision.title,
    p: decision.problem,
    o: decision.options,
    s: decision.status,
    r: decision.regretAnswer,
    tr: decision.tradeoffs,
  };
  const encoded = btoa(encodeURIComponent(JSON.stringify(pub)));
  const base = window.location.origin + window.location.pathname;
  return `${base}#/share/${encoded}`;
}

/**
 * Decode a share link back into decision data
 */
export function decodeShareLink(encoded) {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

/**
 * Generate a Notion-compatible markdown export
 */
export function generateNotionMarkdown(decision) {
  const lines = [
    `# ${decision.title || 'Untitled Decision'}`,
    '',
    decision.problem ? `## The Problem\n\n${decision.problem}\n` : '',
    decision.options?.length ? `## Options\n` : '',
  ];

  decision.options?.forEach((opt, i) => {
    lines.push(`### Option ${i + 1}: ${opt.name || 'Untitled'}`);
    if (opt.sixMonths) lines.push(`**6 months / 2 years:** ${opt.sixMonths}`);
    if (opt.best) lines.push(`**Best case:** ${opt.best}`);
    if (opt.worst) lines.push(`**Worst case:** ${opt.worst}`);
    lines.push('');
  });

  if (decision.tradeoffs) {
    lines.push(`## Tradeoffs\n\n${decision.tradeoffs}\n`);
  }

  if (decision.regretAnswer) {
    lines.push(`## Regret Check\n\n${decision.regretAnswer}\n`);
  }

  lines.push('---');
  lines.push(`*Exported from [Bunker](https://bunker.app)*`);

  return lines.join('\n');
}

/**
 * Trigger a Notion markdown file download
 */
export function exportToNotion(decision) {
  const md = generateNotionMarkdown(decision);
  const slug = (decision.title || 'decision').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bunker-${slug}.md`;
  a.click();
  URL.revokeObjectURL(url);
  return { success: true };
}

/**
 * Post decision summary to Slack via webhook
 */
export async function postToSlack(decision, webhookUrl) {
  const { title, problem, options = [], status, deadline } = decision;
  const chosenOpt = decision.chosenOption;
  const statusText = status === 'decided' ? '✅ Decided' : '🟡 Active';

  const optionText = options.map((o, i) => {
    const check = chosenOpt === o.name ? ' 👉 *CHOSEN*' : '';
    return `• *${o.name}*${check}`;
  }).join('\n');

  const deadlineText = deadline
    ? `📅 Deadline: ${new Date(deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : '';

  const body = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: `📋 ${title || 'Untitled'}`, emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Status:*\n${statusText}` },
          { type: 'mrkdwn', text: `*Options:*\n${options.length}` },
        ],
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Problem:*\n${problem || 'No description'}` },
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Options:*\n${optionText}` },
      },
    ],
  };

  if (deadlineText) {
    body.blocks.push({
      type: 'context',
      elements: [{ type: 'mrkdwn', text: deadlineText }],
    });
  }

  body.blocks.push({
    type: 'divider',
  });

  body.blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: '_Shared from Bunker — deliberate decision making_' }],
  });

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  return { success: res.ok, status: res.status };
}

/**
 * Generate a shareable image (canvas-based summary card)
 */
export async function generateShareImage(decision) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, 1200, 630);

  // Header
  ctx.fillStyle = '#c9d1d9';
  ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText((decision.title || 'Untitled').slice(0, 60), 60, 100);

  // Problem
  if (decision.problem) {
    ctx.fillStyle = '#8b949e';
    ctx.font = '28px -apple-system, BlinkMacSystemFont, sans-serif';
    const probLines = wrapText(ctx, decision.problem.slice(0, 200), 1080, 32);
    let y = 160;
    probLines.forEach(line => {
      ctx.fillText(line, 60, y);
      y += 40;
    });
  }

  // Options
  const startY = 280;
  const optionWidth = 340;
  const gap = 30;
  const startX = 60;

  (decision.options || []).slice(0, 3).forEach((opt, i) => {
    const x = startX + i * (optionWidth + gap);
    const isChosen = decision.chosenOption === opt.name;

    ctx.fillStyle = isChosen ? '#238636' : '#21262d';
    roundRect(ctx, x, startY, optionWidth, 280, 12);
    ctx.fill();

    if (isChosen) {
      ctx.fillStyle = '#3fb950';
      ctx.font = 'bold 22px -apple-system, sans-serif';
      ctx.fillText('✓ CHOSEN', x + 16, startY + 36);
    }

    ctx.fillStyle = '#f0f6fc';
    ctx.font = 'bold 28px -apple-system, sans-serif';
    ctx.fillText(opt.name?.slice(0, 30) || `Option ${i + 1}`, x + 16, startY + (isChosen ? 76 : 52));

    ctx.fillStyle = '#8b949e';
    ctx.font = '22px -apple-system, sans-serif';

    if (opt.best) {
      ctx.fillText('Best: ' + opt.best.slice(0, 60), x + 16, startY + 130);
    }
    if (opt.worst) {
      ctx.fillText('Worst: ' + opt.worst.slice(0, 60), x + 16, startY + 180);
    }
  });

  // Footer
  ctx.fillStyle = '#484f58';
  ctx.font = '20px -apple-system, sans-serif';
  ctx.fillText('Made with Bunker', 60, 600);

  return canvas.toDataURL('image/png');
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx, text, maxWidth, fontSize) {
  ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
  const words = text.split(' ');
  const lines = [];
  let current = '';

  words.forEach(word => {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });

  if (current) lines.push(current);
  return lines;
}

/**
 * Download share image
 */
export async function downloadShareImage(decision) {
  try {
    const dataUrl = await generateShareImage(decision);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `bunker-${(decision.title || 'decision').toLowerCase().replace(/\s+/g, '-')}-summary.png`;
    a.click();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
