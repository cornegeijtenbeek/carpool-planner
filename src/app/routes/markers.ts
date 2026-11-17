import type { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';

export function createStartMarker(coordinate: Coordinate, color: string, text: string) {
    const result = new Feature({ geometry: new Point(fromLonLat(coordinate)) });

    result.setStyle(new Style({
        image: new Circle({
            radius: 6,
            fill: new Fill({ color }),
            stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
        text: new Text({
            text,
            offsetY: -14,
            font: '12px sans-serif',
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: '#fff', width: 3 }),
        }),
    }))

    return result;
}

export function createEndMarker(destination: Coordinate) {
    const result = new Feature({ geometry: new Point(fromLonLat(destination)) })

    result.setStyle(new Style({
        image: new Circle({
        radius: 6,
        fill: new Fill({ color: '#000' }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
    }));

    return result;
}