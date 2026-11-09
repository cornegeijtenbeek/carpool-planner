import { Component, inject, OnInit } from '@angular/core';
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
import { RoutingService } from './routing.service';

const netherlands = [3.31497, 50.803721, 7.092053, 53.510403];
const amsterdam: [number, number] = [4.895168, 52.370216];
const rotterdam: [number, number] = [4.47917, 51.9225];

@Component({
  imports: [],
  selector: 'app-root',
  styleUrl: './app.css',
  template: '<div id="ol-map" class="map-container"></div>',
})
export class App implements OnInit {
  private readonly routingService = inject(RoutingService);

  private routeLayer!: VectorLayer;
  private map!: Map;

  async ngOnInit() {
    this.routeLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({ color: '#1a73e8', width: 4 }),
      }),
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

    await this.showRoute(amsterdam, rotterdam);
  }

  private async showRoute(from: [number, number], to: [number, number]) {
    const geometry = await this.routingService.getDrivingRoute(from, to);

    const routeFeature = new GeoJSON().readFeature(geometry, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });

    this.routeLayer.getSource()?.addFeature(routeFeature);
  }
}
