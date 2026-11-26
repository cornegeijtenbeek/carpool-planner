import { Service } from '@angular/core';
import type { LineString, Position } from 'geojson';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';

interface Result {
  code: 'Ok' | 'Invalid';
  routes: Route[];
  message: string;
}

interface Route {
  distance: number;
  duration: number;
  geometry: LineString;
}

@Service()
export class RoutesService {
  private readonly base = 'https://router.project-osrm.org/route/v1/driving';
  private readonly options = {
    overview: 'full',
    geometries: 'geojson',
    alternatives: 'true',
  };

  public async getFastestRoutes(from: Position, to: Position): Promise<Feature[]> {
    const response = await fetch(
      `${this.base}/${this.format(from, to)}?${new URLSearchParams(this.options)}`,
    );
    if (!response.ok) {
      throw new Error(`OSRM request failed: ${response.status}`);
    }

    const result: Result = await response.json();
    if (result.code !== 'Ok') {
      throw new Error(`OSRM request failed: ${result.message}`);
    }

    return this.readFeatures(result.routes);
  }

  private format(from: Position, to: Position) {
    return `${from[0]},${from[1]};${to[0]},${to[1]}`;
  }

  private readFeatures(routes: Route[]): Feature[] {
    const format = new GeoJSON();
    const options = {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    };

    return routes.map((route) => new Feature(format.readGeometry(route.geometry, options)!));
  }
}
