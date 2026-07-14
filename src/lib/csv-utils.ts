import Papa from 'papaparse';
import type { Business } from '@/components/BusinessCard';

/**
 * Strips all non-digit characters from a phone number string.
 * Kept for GoHighLevel-style imports that expect digits only.
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/** Cupr.os CRM outreach tracker columns (Sales Outreach sheet). */
export interface CuprOsLeadExport {
  'Lead Name': string;
  'Company Name': string;
  'Lead Type': string;
  'Status': string;
  'Source': string;
  'Email ID': string;
  'Mobile No': string;
  'Phone': string;
  'Website': string;
  'Address Line 1': string;
  'City': string;
  'State': string;
  'Country': string;
  'Notes': string;
}

/** @deprecated Prefer CuprOsLeadExport — kept for remapping legacy GHL files. */
export interface GHLLeadExport {
  'Business Name': string;
  'Company': string;
  'Phone': string;
  'Street Address': string;
  'City': string;
  'State': string;
  'Postal Code': string;
  'Website': string;
  'Pipeline': string;
  'Stage': string;
  'Opportunity Name': string;
  'Opportunity Value': string;
  'Opportunity Status': string;
}

export type CuprOsSegment = 'Dispensary' | 'Smoke Shop' | 'Other';

export interface CuprOsExportOptions {
  source?: string;
  leadType?: string;
  status?: string;
  segment?: CuprOsSegment;
  notes?: string;
}

const STATE_FULL_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia',
};

function fullStateName(state: string): string {
  if (!state) return '';
  const trimmed = state.trim();
  if (trimmed.length === 2) {
    return STATE_FULL_NAMES[trimmed.toUpperCase()] || trimmed;
  }
  return trimmed;
}

function streetFromBusiness(b: Business): string {
  if (b.streetAddress?.trim()) return b.streetAddress.trim();
  // Fall back: strip trailing ", City, ST ZIP, Country" from formatted address
  const city = b.location.city?.trim();
  if (city && b.address.includes(city)) {
    return b.address.split(`, ${city}`)[0].trim();
  }
  return b.address || '';
}

function exportPhone(phone: string): string {
  if (!phone || phone === 'No phone provided') return '';
  return phone;
}

/**
 * Maps a Business lead into Cupr.os CRM row shape.
 */
export function businessToCuprOsLead(
  b: Business,
  options: CuprOsExportOptions = {}
): CuprOsLeadExport {
  const city = b.location.city || '';
  const state = b.location.state || '';
  const segment = options.segment || 'Other';
  const segmentLabel =
    segment === 'Other' ? 'business' : segment.toLowerCase();

  const defaultNotes = city
    ? `${city} independent ${segmentLabel}; prime target for digital-gap outreach.`
    : `Independent ${segmentLabel}; prime target for digital-gap outreach.`;

  const leadName = city ? `${b.name} - ${city}` : b.name;

  return {
    'Lead Name': leadName,
    'Company Name': b.name,
    'Lead Type': options.leadType || 'Client',
    'Status': options.status || 'New',
    'Source': options.source || 'Cold Calling',
    'Email ID': '',
    'Mobile No': '',
    'Phone': exportPhone(b.phone),
    'Website': b.website || '',
    'Address Line 1': streetFromBusiness(b),
    'City': city,
    'State': fullStateName(state),
    'Country': 'United States',
    'Notes': options.notes?.trim() || defaultNotes,
  };
}

/**
 * Downloads a data array as a CSV file with UTF-8 BOM for Excel compatibility.
 */
export function downloadAsCSV(data: object[], filename: string) {
  if (data.length === 0) return;

  const csvContent = Papa.unparse(data, {
    quotes: true,
    header: true,
  });

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const now = new Date();
  const dateStr = `${now.getFullYear()}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getDate().toString().padStart(2, '0')}`;

  const cleanFilename = filename?.trim() || `cupros_leads_${dateStr}.csv`;
  const finalFilename = cleanFilename.endsWith('.csv') ? cleanFilename : `${cleanFilename}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', finalFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
