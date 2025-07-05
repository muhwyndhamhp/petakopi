import { type OpenHour } from './openHour';
import type { Selectable } from 'kysely';
import {
  custom,
  minLength,
  number,
  object,
  pipe,
  string,
  transform,
} from 'valibot';
import type { LatLngTuple } from 'leaflet';

export interface CoffeeTable {
  id: string;
  lat: number;
  lng: number;
  address: string;
  name: string;
  rating: number;
  created_at: Date | string;
  updated_at: Date | string;
  status: 'known' | 'reviewed' | 'closed';
  open_hours: OpenHour;
}

export type Coffee = Selectable<CoffeeTable>;

const validateLatLng = (lat: number, lng: number): boolean => {
  const isLatValid = !isNaN(lat) && lat >= -90 && lat <= 90;
  const isLngValid = !isNaN(lng) && lng >= -180 && lng <= 180;
  return isLatValid && isLngValid;
};

const latLngFromStringSchema = pipe(
  string(),
  custom((value) => {
    const parts = (value as string).trim().split(',');
    if (parts.length !== 2) return false;

    const lat = parseFloat(parts[0].trim());
    const lng = parseFloat(parts[1].trim());

    return validateLatLng(lat, lng);
  }, 'Must be a comma-separated latitude and longitude with valid ranges'),
  transform<string, LatLngTuple>((input) => {
    const parts = (input as string).trim().split(',');

    const lat = parseFloat(parts[0].trim());
    const lng = parseFloat(parts[1].trim());

    return [lat, lng];
  })
);

const latLngTupleSchema = custom<LatLngTuple>((value) => {
  if (!Array.isArray(value) || value.length !== 2) return false;

  const [lat, lng] = value;
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    validateLatLng(lat, lng)
  );
}, 'Must be a valid LatLngTuple with latitude between -90 and 90, longitude between -180 and 180');

const openHourSchema = pipe(
  string(),
  custom((value) => {
    const parts = (value as string).trim().split('-');
    if (parts.length !== 2) return false;

    for (const p of parts) {
      const subPart = p.trim().split(':');
      if (subPart.length !== 2) return false;

      const hour = parseInt(subPart[0]);
      const minute = parseInt(subPart[1]);

      if (hour > 24 || hour < 0) {
        return false;
      }

      if (minute > 60 || minute < 0) {
        return false;
      }
    }

    return true;
  }, 'Must be in HH:MM - HH:MM format')
);

export const ModifyCoffeeSchema = object({
  shopName: pipe(string(), minLength(10)),
  latLong: latLngFromStringSchema,
  openHours: openHourSchema,
  rating: number(),
  address: pipe(string(), minLength(20)),
});

export const ModifyCoffeeReqSchema = object({
  ...ModifyCoffeeSchema.entries,
  latLong: latLngTupleSchema,
});
