import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

export class DarkGrayTileLayer extends TileLayer {
  constructor() {
    super({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      }),
    });
  }
}
