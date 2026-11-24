import { Service } from '@angular/core';
import type { LineString, Position } from 'geojson';

@Service()
export class RoutingService {
  async getDrivingRoute(from: Position, to: Position): Promise<LineString> {
    const coords = `${from[0]},${from[1]};${to[0]},${to[1]}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OSRM request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.routes[0].geometry;
  }
}
