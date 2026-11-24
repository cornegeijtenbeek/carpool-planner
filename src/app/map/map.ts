import { Component, inject, type OnInit } from '@angular/core';
import TileLayer from 'ol/layer/Tile';
import OlMap from 'ol/Map';
import { transformExtent } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import { RoutingService } from '../routes/routing.service';
import { MembersService } from '../members/members.service';
import type { Member } from '../members/member.interface';
import { RouteLayer } from '../routes/route-layer';
import { Coordinate } from 'ol/coordinate';
import { createEndMarker } from '../routes/markers';

const netherlands = [3.31497, 50.803721, 7.092053, 53.510403];

@Component({
  imports: [],
  selector: 'app-map',
  styleUrl: './map.css',
  template: '<div id="map" class="map-container"></div>',
})
export class Map implements OnInit {
  private readonly memberService = inject(MembersService);
  private readonly routingService = inject(RoutingService);
  private readonly routeLayer = new RouteLayer();

  private map!: OlMap;

  async ngOnInit() {
    this.map = new OlMap({
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
      target: 'map',
    });

    this.map.getView().fit(transformExtent(netherlands, 'EPSG:4326', 'EPSG:3857'));

    const destination = [4.6743188, 52.5116925];
    const members = await this.memberService.get();

    await Promise.all(members.map((member) => this.addRouteForMember(member, destination)));

    this.routeLayer.getSource()?.addFeature(createEndMarker(destination));
  }

  private async addRouteForMember(member: Member, destination: Coordinate) {
    const result = await this.routingService.getDrivingRoute(member.coordinate, destination);

    this.routeLayer.add(member, result);
  }
}
