import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeToggle } from './theme-toggle';
import { ThemeService } from './theme.service';

describe('ThemeToggle', () => {
  let component: ThemeToggle;
  let fixture: ComponentFixture<ThemeToggle>;
  let themeService: ThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggle);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render light-mode label and aria-pressed=false by default', () => {
    // Act
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    // Assert
    expect(button.textContent?.trim()).toBe('Switch to dark map');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('should switch to dark-mode label and aria-pressed=true when the service is in dark mode', () => {
    // Arrange
    themeService.toggle();
    fixture.detectChanges();

    // Act
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    // Assert
    expect(button.textContent?.trim()).toBe('Switch to light map');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('should toggle the theme service when clicked', () => {
    // Arrange
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    // Act
    button.click();

    // Assert
    expect(themeService.isDarkMode()).toBe(true);
  });
});
