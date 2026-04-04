export interface Bank {
  key: string;
  name: string;
  title?: string;
  account: string;
  routing: string;
  branch: string;
}

export interface Vehicle {
  key: string;
  name: string;
  carNumber: string;
  docType: string;
  expiry: string;
}

export interface Document {
  key: string;
  name: string;
  number: string;
  type: string;
  expiry: string;
  file?: string;
}

export interface LicenseInfo {
  expiry: string;
  days: number;
  status: string;
}

export interface ExpirySummary {
  expired: Array<{ car: string; doc: string; days?: number; type?: string }>;
  warning: Array<{ car: string; doc: string; days: number; type?: string }>;
}

export interface BackupItem {
  key: string;
  size?: number;
}

export interface AppSettings {
  editEnabled: boolean;
  deleteEnabled: boolean;
}

export const VEHICLE_DOC_TYPES = [
  'Registration Certificate (Smart Card)',
  'Fitness Certificate',
  'Tax Token',
  'Route Permit',
  'Insurance Certificate',
  'Others',
];

export const DOCUMENT_TYPES = [
  'NID',
  'Passport',
  'Driving License',
  'Trade License',
  'TIN Certificate',
  'BIN Certificate',
  'Firearms License',
  'Import License',
  'Export License',
  'Tender (PWD/LGED/RHD) License',
  'Others',
];
