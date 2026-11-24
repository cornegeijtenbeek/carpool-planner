import XYZ from 'ol/source/XYZ';
import { DarkGrayTileLayer } from './dark-gray-tile-layer';

describe('DarkGrayTileLayer', () => {
  it('should create an instance', () => {
    expect(new DarkGrayTileLayer()).toBeTruthy();
  });

  it('should use an XYZ source', () => {
    // Act
    const layer = new DarkGrayTileLayer();

    // Assert
    expect(layer.getSource()).toBeInstanceOf(XYZ);
  });

  it('should point at the dark gray base map', () => {
    // Act
    const layer = new DarkGrayTileLayer();
    const source = layer.getSource() as XYZ;

    // Assert
    expect(source.getUrls()).toEqual([
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    ]);
  });
});
