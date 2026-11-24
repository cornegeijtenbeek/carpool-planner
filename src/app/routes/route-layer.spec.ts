import type { LineString } from 'geojson';
import type { Member } from '../members/member.interface';
import { RouteLayer } from './route-layer';

describe('RouteLayer', () => {
  const member: Member = {
    id: '1',
    name: 'Alice',
    coordinate: [4.895168, 52.370216],
    color: '#ff0000',
  };

  const geometry: LineString = {
    type: 'LineString',
    coordinates: [
      [4.895168, 52.370216],
      [4.9, 52.37],
    ],
  };

  it('should create an instance', () => {
    expect(new RouteLayer()).toBeTruthy();
  });

  it('should add the route geometry and a start marker to the source', async () => {
    // Arrange
    const layer = new RouteLayer();

    // Act
    await layer.add(member, geometry);

    // Assert
    const features = layer.getSource()?.getFeatures() ?? [];
    expect(features.length).toBe(2);
  });

  it('should style the route feature with a semi-transparent version of the member color', async () => {
    // Arrange
    const layer = new RouteLayer();

    // Act
    await layer.add(member, geometry);

    // Assert
    const [routeFeature] = layer.getSource()?.getFeatures() ?? [];
    const style = routeFeature.getStyle();
    const stroke = Array.isArray(style) ? style[0].getStroke() : style?.getStroke();
    const color = stroke?.getColor() as number[];

    expect(color[0]).toBe(255);
    expect(color[1]).toBe(0);
    expect(color[2]).toBe(0);
    expect(color[3]).toBe(0.5);
  });

  it('should accumulate features across multiple calls', async () => {
    // Arrange
    const layer = new RouteLayer();

    // Act
    await layer.add(member, geometry);
    await layer.add({ ...member, id: '2', name: 'Bob' }, geometry);

    // Assert
    expect(layer.getSource()?.getFeatures().length).toBe(4);
  });
});
