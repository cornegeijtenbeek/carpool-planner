import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to light mode', () => {
    expect(service.isDarkMode()).toBe(false);
  });

  it('should toggle dark mode on', () => {
    // Act
    service.toggle();

    // Assert
    expect(service.isDarkMode()).toBe(true);
  });

  it('should toggle dark mode back off', () => {
    // Act
    service.toggle();
    service.toggle();

    // Assert
    expect(service.isDarkMode()).toBe(false);
  });
});
