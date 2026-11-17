import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import type { Member } from '../members/member.interface';
import GeoJSON from 'ol/format/GeoJSON';
import { asArray } from 'ol/color';
import { Stroke, Style } from 'ol/style';
import { createStartMarker } from './markers';
import Feature from 'ol/Feature';
import type { LineString } from 'geojson';

export class RouteLayer extends VectorLayer {
    constructor() {
        super({ source: new VectorSource() })
    }

    public async add({ name, coordinate, color }: Member, geometry: LineString) {
        this.getSource()?.addFeatures([
            ...this.createRoutes(geometry, color),
            createStartMarker(coordinate, color, name),
        ]);
    }

    private createRoutes(geometry: LineString, color: string) {
        const result = this.readFeature(geometry)

        this.addStyles(result, color)

        return result;
    }

    private readFeature(geometry: LineString) {
        const result = new GeoJSON().readFeature(geometry, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857',
        });

        return Array.isArray(result) ? result : [result];
    }

    private addStyles(feature: Feature[], color: string) {
        const routeColor = asArray(color).slice();
        routeColor[3] = 0.5;

        const style = new Style({
            stroke: new Stroke({ color: routeColor, width: 4 }),
        });

        for (const routeFeature of feature) {
            routeFeature.setStyle(style);
        }
    }
}
