import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import type { Member } from '../members/member.interface';
import { asArray } from 'ol/color';
import { Stroke, Style } from 'ol/style';
import { createStartMarker } from './markers';
import Feature from 'ol/Feature';

export class RouteLayer extends VectorLayer {
  constructor() {
    super({ source: new VectorSource() });
  }

  public add({ name, coordinate, color }: Member, features: Feature[]) {
    this.addStyles(features, color);

    this.getSource()?.addFeatures(features);
    this.getSource()?.addFeature(createStartMarker(coordinate, color, name));
  }

  private addStyles(feature: Feature[], color: string) {
    const routeColor = asArray(color).slice();
    routeColor[3] = 0.5;

    const style = new Style({
      stroke: new Stroke({ color: routeColor, width: 6 }),
    });

    for (const routeFeature of feature) {
      routeFeature.setStyle(style);
    }
  }
}
