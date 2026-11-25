import { Component, input, output, signal } from '@angular/core';
import { FormField, FormRoot, form, pattern, required } from '@angular/forms/signals';
import type { Coordinate } from 'ol/coordinate';

const COORDINATE_PATTERN = /^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/;

@Component({
  imports: [FormField, FormRoot],
  selector: 'app-destination-search',
  styleUrl: './destination-search.css',
  template: `
    <form [formRoot]="searchForm" class="destination-search" (submit)="onSearch()">
      <label for="destination">Destination (longitude, latitude)</label>
      <input
        id="destination"
        type="text"
        placeholder="4.123456, 52.123456"
        [formField]="searchForm.destination"
      />
      @if (searchForm.destination().touched() && searchForm.destination().invalid()) {
        <p class="destination-search__error" role="alert">
          Enter coordinates as "longitude, latitude"
        </p>
      }
      <button type="submit" [disabled]="disabled()">Search</button>
    </form>
  `,
})
export class DestinationSearch {
  readonly disabled = input(false);
  readonly search = output<Coordinate>();

  private readonly model = signal({ destination: '' });
  protected readonly searchForm = form(this.model, (path) => {
    required(path.destination, { message: 'Enter a destination' });
    pattern(path.destination, COORDINATE_PATTERN, {
      message: 'Use "longitude, latitude" format',
    });
  });

  protected onSearch() {
    if (!this.searchForm().valid()) {
      return;
    }

    const [longitude, latitude] = this.model()
      .destination.split(',')
      .map((value) => Number(value.trim()));

    this.search.emit([longitude, latitude]);
  }
}
