import { ExistingRegions } from '@/utils/getRegionsData';

export function getIdentifier(value: ExistingRegions) {
  switch (value) {
    case ExistingRegions.QLD:
      return 'HTLPQ';
    case ExistingRegions.VIC:
      return 'HTTRV';
    case ExistingRegions.NSW:
      return 'HTTRN';
    case ExistingRegions.WA:
      return 'HTTRW';
    default:
      return value;
  }
}
