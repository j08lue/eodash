import Map from 'ol/Map';
import View from 'ol/View';
import Attribution from 'ol/control/Attribution';
import FullScreen from 'ol/control/FullScreen';
import Zoom from 'ol/control/Zoom';
import MousePosition from 'ol/control/MousePosition';
import { toStringXY } from 'ol/coordinate';

import 'ol/ol.css';
import './olControls.css';


class VueMap {
  constructor(id) {
    this.controls = [
      new FullScreen({
        className: 'v-card primary--text ol-full-screen',
      }),
      new Zoom({
        className: 'v-card primary--text ol-zoom',
      }),
      new MousePosition({
        coordinateFormat: (coordinates) => {
          let lonValue = coordinates[0] % 360;
          if (lonValue > 180) {
            lonValue -= 360;
          } else if (lonValue < -180) {
            lonValue += 360;
          }
          return `<span>${toStringXY([lonValue, coordinates[1]], 3)}</span>`;
        },
        projection: 'EPSG:4326',
        className: 'v-card ol-control primary--text ol-mouse-position',
        placeholder: false,
      }),
      new Attribution({
        className: 'v-card ol-attribution',
      }),
    ];
    this.map = new Map({
      controls: this.controls,
      view: new View({
        zoom: 0,
        center: [0, 0],
        padding: [0, 0, 0, 0],
        enableRotation: false,
      }),
    });
    this.map.set('id', id);
  }
}
const mapRegistry = {};

/**
 * Returns the ol map with the given id.
 * Will instantiate a new map if not already existing.
 * @param {string} id id of map
 * @returns {Map} ol map
 */
export default function getMapInstance(id) {
  const map = mapRegistry[id];
  if (!map) {
    mapRegistry[id] = new VueMap(id);
  }
  return mapRegistry[id];
}
