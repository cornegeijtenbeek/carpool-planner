import { Component, effect, inject, signal, type OnInit } from '@angular/core';
import OlMap from 'ol/Map';
import { transformExtent } from 'ol/proj';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import { RoutesService } from '../routes/routes.service';
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
    <app-destination-search (search)="onSearch($event)" [disabled]="isSearching()" />
    <app-theme-toggle />
  `,
})
export class Map implements OnInit {
  private readonly memberService = inject(MembersService);
  private readonly routesService = inject(RoutesService);
  private readonly themeService = inject(ThemeService);
  private readonly lightGrayTileLayer = new LightGrayTileLayer();
  private readonly darkGrayTileLayer = new DarkGrayTileLayer();
  private readonly routeLayer = new RouteLayer();

  protected readonly isSearching = signal(false);

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
    if (this.isSearching()) {
      return;
    }

    this.isSearching.set(true);

    try {
      this.routeLayer.getSource()?.clear();
      this.routeLayer.getSource()?.addFeature(createEndMarker(destination));

      const members = await this.memberService.get();

      await Promise.all(members.map((member) => this.addRoutesForMember(member, destination)));
    } catch (error) {
      console.error('Failed to search for routes', error);
    } finally {
      this.isSearching.set(false);
    }
  }

  private async addRoutesForMember(member: Member, destination: Coordinate) {
    const result = await this.routesService.getFastestRoutes(member.coordinate, destination);

    this.routeLayer.add(member, result);
  }
}
