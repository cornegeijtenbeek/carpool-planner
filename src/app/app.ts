import { Component } from '@angular/core';
import { Map } from './map/map';

@Component({
  imports: [Map],
  selector: 'app-root',
  styleUrl: './app.css',
  template: '<app-map></app-map>',
})
export class App {}
