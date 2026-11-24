import { Service, signal } from '@angular/core';

@Service()
export class ThemeService {
  readonly isDarkMode = signal(false);

  toggle() {
    this.isDarkMode.update((isDarkMode) => !isDarkMode);
  }
}
