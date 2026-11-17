import type { Coordinate } from 'ol/coordinate';

export interface Member {
  id: string;
  name: string;
  coordinate: Coordinate;
  color: string;
}
