import { Component, inject, type OnInit } from '@angular/core';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { asArray } from 'ol/color';
import { fromLonLat, transformExtent } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';
import { RoutingService } from '../routing.service';
import { type CarpoolRoute, RoutesService } from '../routes.service';

const netherlands = [3.31497, 50.803721, 7.092053, 53.510403];

@Component({
  imports: [],
  selector: 'ol-map',
  styleUrl: './ol-map.css',
  template: '<div id="ol-map" class="map-container"></div>',
})
export class OlMap implements OnInit {
  private readonly routingService = inject(RoutingService);
  private readonly routesService = inject(RoutesService);

  private routeLayer!: VectorLayer;
  private map!: Map;

  async ngOnInit() {
    this.routeLayer = new VectorLayer({
      source: new VectorSource(),
    });
    this.map = new Map({
      view: new View(),
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          }),
        }),
        this.routeLayer,
      ],
      controls: defaultControls({ attribution: false, rotate: false, zoom: false }),
      target: 'ol-map'
    });

    this.map
      .getView()
      .fit(transformExtent(netherlands, 'EPSG:4326', 'EPSG:3857'));

    const routes = await this.routesService.getRoutes();
    await Promise.all(routes.map((route, index) => this.showRoute(route, index)));
  }

  private async showRoute({ name, from, to, color }: CarpoolRoute, index: number) {
    const geometry = await this.routingService.getDrivingRoute(from, to);

    const result = new GeoJSON().readFeature(geometry, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });
    const routeFeatures = Array.isArray(result) ? result : [result];

    const routeColor = asArray(color).slice();
    routeColor[3] = 0.5;

    const style = new Style({
      stroke: new Stroke({ color: routeColor, width: 4 }),
    });
    for (const routeFeature of routeFeatures) {
      routeFeature.setStyle(style);
    }

    const startMarker = new Feature({ geometry: new Point(fromLonLat(from)) });
    startMarker.setStyle(
      new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
        text: new Text({
          text: name,
          offsetY: -14,
          font: '12px sans-serif',
          fill: new Fill({ color: '#000' }),
          stroke: new Stroke({ color: '#fff', width: 3 }),
        }),
      }),
    );

    this.routeLayer.getSource()?.addFeatures([...routeFeatures, startMarker]);
  }
}
