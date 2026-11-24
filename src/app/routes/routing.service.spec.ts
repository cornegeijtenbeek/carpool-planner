import { TestBed } from '@angular/core/testing';
import type { LineString } from 'geojson';
import { RoutingService } from './routing.service';

describe('RoutingService', () => {
  let service: RoutingService;
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutingService);

    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request a driving route between the given coordinates', async () => {
    // Arrange
    const geometry: LineString = { type: 'LineString', coordinates: [] };
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ routes: [{ geometry }] }),
    });

    // Act
    await service.getDrivingRoute([4.895168, 52.370216], [4.9, 52.37]);

    // Assert
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://router.project-osrm.org/route/v1/driving/4.895168,52.370216;4.9,52.37?overview=full&geometries=geojson',
    );
  });

  it('should resolve with the route geometry from the response', async () => {
    // Arrange
    const geometry: LineString = {
      type: 'LineString',
      coordinates: [
        [4.895168, 52.370216],
        [4.9, 52.37],
      ],
    };
    fetchSpy.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ routes: [{ geometry }] }),
    });

    // Act
    const result = await service.getDrivingRoute([4.895168, 52.370216], [4.9, 52.37]);

    // Assert
    expect(result).toEqual(geometry);
  });

  it('should throw when the request fails', async () => {
    // Arrange
    fetchSpy.mockResolvedValue({ ok: false, status: 500 });

    // Act & Assert
    await expect(service.getDrivingRoute([4.895168, 52.370216], [4.9, 52.37])).rejects.toThrow(
      'OSRM request failed: 500',
    );
  });
});
