import XYZ from 'ol/source/XYZ';
import { LightGrayTileLayer } from './light-gray-tile-layer';

describe('LightGrayTileLayer', () => {
  it('should create an instance', () => {
    expect(new LightGrayTileLayer()).toBeTruthy();
  });

  it('should use an XYZ source', () => {
    // Act
    const layer = new LightGrayTileLayer();

    // Assert
    expect(layer.getSource()).toBeInstanceOf(XYZ);
  });

  it('should point at the light gray base map', () => {
    // Act
    const layer = new LightGrayTileLayer();
    const source = layer.getSource() as XYZ;

    // Assert
    expect(source.getUrls()).toEqual([
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    ]);
  });
});
