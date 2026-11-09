import { Component, OnInit } from '@angular/core';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import { transformExtent } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';

const netherlands = [3.31497, 50.803721, 7.092053, 53.510403];

@Component({
  imports: [],
  selector: 'app-root',
  styleUrl: './app.css',
  template: '<div id="ol-map" class="map-container"></div>',
})
export class App implements OnInit {
  map!: Map;

  ngOnInit() {
    this.map = new Map({
      view: new View(),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      controls: defaultControls({ attribution: false, rotate: false, zoom: false }),
      target: 'ol-map'
    });

    this.map
      .getView()
      .fit(transformExtent(netherlands, 'EPSG:4326', 'EPSG:3857'));
  }
}
