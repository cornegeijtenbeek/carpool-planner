import { Component, inject, type OnInit } from '@angular/core';
import GeoJSON from 'ol/format/GeoJSON';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { transformExtent } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import { Stroke, Style } from 'ol/style';
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
          source: new OSM(),
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
    await Promise.all(routes.map(route => this.showRoute(route)));
  }

  private async showRoute({ from, to, color }: CarpoolRoute) {
    const geometry = await this.routingService.getDrivingRoute(from, to);

    const result = new GeoJSON().readFeature(geometry, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });
    const routeFeatures = Array.isArray(result) ? result : [result];

    const style = new Style({
      stroke: new Stroke({ color, width: 4 }),
    });
    for (const routeFeature of routeFeatures) {
      routeFeature.setStyle(style);
    }

    this.routeLayer.getSource()?.addFeatures(routeFeatures);
  }
}
