import type { Opportunity } from '../types/opportunity.types';
import { formatDeadline } from './deadlineUtils';

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportToCsv(opportunities: Opportunity[]): string {
  const headers = [
    'name', 'organization', 'type', 'status', 'deadline', 'countries',
    'level', 'funding', 'applicationLink', 'notes',
  ];
  const lines = [headers.join(',')];
  for (const o of opportunities) {
    lines.push(
      [
        o.name, o.organization ?? '', o.type, o.status,
        formatDeadline(o.deadline), o.countries.join('; '),
        o.level ?? '', o.funding ?? '', o.applicationLink ?? '', o.notes ?? '',
      ].map((v) => escapeCsv(String(v))).join(',')
    );
  }
  return lines.join('\n');
}

export function downloadFile(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToJson(opportunities: Opportunity[]): void {
  downloadFile(JSON.stringify(opportunities, null, 2), 'opportunities.json', 'application/json');
}

export function exportToCsvFile(opportunities: Opportunity[]): void {
  downloadFile(exportToCsv(opportunities), 'opportunities.csv', 'text/csv');
}
