import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { LineString } from 'geojson';
import type { Member } from '../members/member.interface';
import { MembersService } from '../members/members.service';
import { RoutingService } from '../routes/routing.service';
import { ThemeService } from '../theme/theme.service';
import { Map } from './map';

describe('Map', () => {
  let component: Map;
  let fixture: ComponentFixture<Map>;
  let membersService: { get: ReturnType<typeof vi.fn> };
  let routingService: { getDrivingRoute: ReturnType<typeof vi.fn> };
  let themeService: ThemeService;

  const members: Member[] = [
    { id: '1', name: 'Alice', coordinate: [4.9, 52.37], color: '#ff0000' },
    { id: '2', name: 'Bob', coordinate: [5.1, 52.1], color: '#00ff00' },
  ];

  const geometry: LineString = {
    type: 'LineString',
    coordinates: [
      [4.9, 52.37],
      [4.123456, 52.123456],
    ],
  };

  beforeEach(async () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );

    membersService = { get: vi.fn().mockResolvedValue(members) };
    routingService = { getDrivingRoute: vi.fn().mockResolvedValue(geometry) };

    await TestBed.configureTestingModule({
      imports: [Map],
      providers: [
        { provide: MembersService, useValue: membersService },
        { provide: RoutingService, useValue: routingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Map);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the light base map and hide the dark base map by default', () => {
    expect(component['lightGrayTileLayer'].getVisible()).toBe(true);
    expect(component['darkGrayTileLayer'].getVisible()).toBe(false);
  });

  it('should swap base maps when dark mode is toggled', () => {
    // Act
    themeService.toggle();
    fixture.detectChanges();

    // Assert
    expect(component['lightGrayTileLayer'].getVisible()).toBe(false);
    expect(component['darkGrayTileLayer'].getVisible()).toBe(true);
  });

  it('should fetch a driving route for every member when searching', async () => {
    // Act
    await component['onSearch']([4.123456, 52.123456]);

    // Assert
    expect(membersService.get).toHaveBeenCalled();
    expect(routingService.getDrivingRoute).toHaveBeenCalledTimes(members.length);
    expect(routingService.getDrivingRoute).toHaveBeenCalledWith(
      members[0].coordinate,
      [4.123456, 52.123456],
    );
    expect(routingService.getDrivingRoute).toHaveBeenCalledWith(
      members[1].coordinate,
      [4.123456, 52.123456],
    );
  });

  it('should clear previous routes and add an end marker when searching', async () => {
    // Arrange
    const routeLayer = component['routeLayer'];
    const clearSpy = vi.spyOn(routeLayer.getSource()!, 'clear');

    // Act
    await component['onSearch']([4.123456, 52.123456]);

    // Assert
    expect(clearSpy).toHaveBeenCalled();
    expect(routeLayer.getSource()?.getFeatures().length).toBeGreaterThan(0);
  });

  it('should ignore a new search while one is already in flight', async () => {
    // Arrange
    let resolveFirstRoute!: (value: LineString) => void;
    routingService.getDrivingRoute.mockReturnValueOnce(
      new Promise<LineString>((resolve) => (resolveFirstRoute = resolve)),
    );

    // Act
    const firstSearch = component['onSearch']([4.123456, 52.123456]);
    const secondSearch = component['onSearch']([5, 52]);
    resolveFirstRoute(geometry);
    await Promise.all([firstSearch, secondSearch]);

    // Assert
    expect(membersService.get).toHaveBeenCalledTimes(1);
  });

  it('should flip isSearching back to false once a search settles', async () => {
    // Act
    await component['onSearch']([4.123456, 52.123456]);

    // Assert
    expect(component['isSearching']()).toBe(false);
  });

  it('should flip isSearching back to false even when a search fails', async () => {
    // Arrange
    routingService.getDrivingRoute.mockRejectedValue(new Error('OSRM request failed: 500'));

    // Act
    await component['onSearch']([4.123456, 52.123456]);

    // Assert
    expect(component['isSearching']()).toBe(false);
  });

  it('should log an error when fetching members fails', async () => {
    // Arrange
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const membersError = new Error('Members request failed');
    membersService.get.mockRejectedValueOnce(membersError);

    // Act
    await component['onSearch']([4.123456, 52.123456]);

    // Assert
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to search for routes', membersError);
  });
});
