import { Component, effect, inject, type OnInit } from '@angular/core';
import OlMap from 'ol/Map';
import { transformExtent } from 'ol/proj';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import { RoutingService } from '../routes/routing.service';
import { MembersService } from '../members/members.service';
import type { Member } from '../members/member.interface';
import { RouteLayer } from '../routes/route-layer';
import { Coordinate } from 'ol/coordinate';
import { createEndMarker } from '../routes/markers';
import { LightGrayTileLayer } from '../layers/light-gray-tile-layer';
import { DarkGrayTileLayer } from '../layers/dark-gray-tile-layer';
import { ThemeService } from '../theme/theme.service';
import { ThemeToggle } from '../theme/theme-toggle';
import { DestinationSearch } from '../search/destination-search';

const netherlands = [3.31497, 50.803721, 7.092053, 53.510403];

@Component({
  imports: [ThemeToggle, DestinationSearch],
  selector: 'app-map',
  styleUrl: './map.css',
  template: `
    <div id="map" class="map-container"></div>
    <app-destination-search (search)="onSearch($event)" />
    <app-theme-toggle />
  `,
})
export class Map implements OnInit {
  private readonly memberService = inject(MembersService);
  private readonly routingService = inject(RoutingService);
  private readonly themeService = inject(ThemeService);
  private readonly lightGrayTileLayer = new LightGrayTileLayer();
  private readonly darkGrayTileLayer = new DarkGrayTileLayer();
  private readonly routeLayer = new RouteLayer();

  private map!: OlMap;

  constructor() {
    effect(() => {
      const isDarkMode = this.themeService.isDarkMode();

      this.lightGrayTileLayer.setVisible(!isDarkMode);
      this.darkGrayTileLayer.setVisible(isDarkMode);
    });
  }

  async ngOnInit() {
    this.map = new OlMap({
      view: new View(),
      layers: [this.lightGrayTileLayer, this.darkGrayTileLayer, this.routeLayer],
      controls: defaultControls({ attribution: false, rotate: false, zoom: false }),
      target: 'map',
    });

    this.map.getView().fit(transformExtent(netherlands, 'EPSG:4326', 'EPSG:3857'));
  }

  protected async onSearch(destination: Coordinate) {
    this.routeLayer.getSource()?.clear();
    this.routeLayer.getSource()?.addFeature(createEndMarker(destination));

    const members = await this.memberService.get();

    await Promise.all(members.map((member) => this.addRouteForMember(member, destination)));
  }

  private async addRouteForMember(member: Member, destination: Coordinate) {
    const result = await this.routingService.getDrivingRoute(member.coordinate, destination);

    this.routeLayer.add(member, result);
  }
}
