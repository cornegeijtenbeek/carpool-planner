import { Component } from '@angular/core';
import { OlMap } from './ol-map/ol-map';

@Component({
  imports: [OlMap],
  selector: 'app-root',
  styleUrl: './app.css',
  template: '<ol-map></ol-map>',
})
export class App {}
