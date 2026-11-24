import { Component, inject } from '@angular/core';
import { ThemeService } from './theme.service';

@Component({
  imports: [],
  selector: 'app-theme-toggle',
  styleUrl: './theme-toggle.css',
  template: `
    <button
      type="button"
      class="theme-toggle"
      [attr.aria-pressed]="themeService.isDarkMode()"
      (click)="themeService.toggle()"
    >
      {{ themeService.isDarkMode() ? 'Switch to light map' : 'Switch to dark map' }}
    </button>
  `,
})
export class ThemeToggle {
  protected readonly themeService = inject(ThemeService);
}
