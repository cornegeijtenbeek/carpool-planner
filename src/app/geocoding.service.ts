import { Service } from '@angular/core';
import type { Position } from 'geojson';

interface NominatimResult {
  lon: string;
  lat: string;
}

@Service()
export class GeocodingService {
  async geocode(address: string): Promise<Position | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Nominatim request failed: ${response.status}`);
    }

    const results: NominatimResult[] = await response.json();
    if (results.length === 0) {
      return null;
    }

    const [result] = results;
    return [Number(result.lon), Number(result.lat)];
  }
}
