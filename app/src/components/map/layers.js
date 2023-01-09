import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import VectorTileSource from 'ol/source/VectorTile';
import XYZSource from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import countries from '@/assets/countries.json';
import {
  Fill, Stroke, Style, Circle,
} from 'ol/style';
import TileWMS from 'ol/source/TileWMS';
import GeoTIFF from 'ol/source/GeoTIFF';
import WebGLTileLayer from 'ol/layer/WebGLTile';
import { MVT } from 'ol/format';
import MapLibreLayer from '@geoblocks/ol-maplibre-layer';
import store from '@/store';
import TileGrid from 'ol/tilegrid/TileGrid';
import { createXYZ } from 'ol/tilegrid';
import { Group } from 'ol/layer';
import VectorTileLayer from 'ol/layer/VectorTile';
import { applyStyle } from 'ol-mapbox-style';
import * as flatgeobuf from 'flatgeobuf/dist/flatgeobuf-geojson.min';
import { bbox } from 'ol/loadingstrategy';
import { get as getProj, transformExtent } from 'ol/proj';
import { fetchCustomAreaObjects, fetchCustomDataOptions } from '@/helpers/customAreaObjects';

import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

const DEFAULT_PROJECTION = 'EPSG:3857';
const geoJsonFormat = new GeoJSON({
  featureProjection: DEFAULT_PROJECTION,
});
const countriesSource = new VectorSource({
  features: geoJsonFormat.readFeatures(countries),
});

/**
 * manually fetches geojson features and replaces the features in the source
 * invalid `null`-ids will be transformed into `undefined`-IDs
 * @param {*} source ol vector source (features of this source will be replaced)
 * @param {String} url geojson url
 */

function createProjection(name, def, extent) {
  proj4.defs(name, def);
  register(proj4);
  const projection = getProj(name);
  projection.setExtent(extent);
  return projection;
}

export function getProjectionOl(projectionLike) {
  // for internal conversions
  if (typeof projectionLike === 'string') {
    // expecting EPSG:4326 or EPSG:3857 or something OL supports out of box
    return getProj(projectionLike);
  }
  if (projectionLike) {
    // expecting an object with name, def, extent for proj4 to register custom projection
    return createProjection(projectionLike.name, projectionLike.def, projectionLike.extent);
  }
  // default: EPSG:4326 when not set
  return getProj('EPSG:4326');
}

export async function fetchData({
  usedTime, config, drawnArea, source,
}) {
  // fetching of customFeatures
  if (!config?.features || (config.customAreaFeatures && !drawnArea?.area)) {
    source.clear();
    return;
  }
  try {
    const options = fetchCustomDataOptions(usedTime, config, store);
    const custom = await fetchCustomAreaObjects(
      options,
      drawnArea?.area,
      config,
      {},
      'features',
      store,
    );
    source.clear();
    if (custom?.features && custom.features.length) {
      const features = geoJsonFormat.readFeatures(custom);
      features.forEach((ftr) => {
        if (ftr.getId() === null) {
          ftr.setId(undefined);
        }
        if (ftr.geometry) {
          ftr.setGeometry(geoJsonFormat.readGeometry(ftr.geometry));
        }
      });
      source.addFeatures(features);
    }
  } catch (err) {
    source.clear();
    console.error(err);
  }
}

function fgbBoundingBox(extent, projection) {
  // minx, miny, maxx, maxy
  const transformedExtent = transformExtent(extent, projection.getCode(), 'EPSG:4326');
  return {
    minX: transformedExtent[0],
    minY: transformedExtent[1],
    maxX: transformedExtent[2],
    maxY: transformedExtent[3],
  };
}

function createFromTemplate(template, tileCoord) {
  const zRegEx = /\{z\}/g;
  const xRegEx = /\{x\}/g;
  const yRegEx = /\{y\}/g;
  const dashYRegEx = /\{-y\}/g;
  return template.replace(zRegEx, tileCoord[0].toString())
    .replace(xRegEx, tileCoord[1].toString())
    .replace(yRegEx, tileCoord[2].toString())
    .replace(dashYRegEx, () => {
      // eslint-disable-next-line no-bitwise
      const y = (1 << tileCoord[0]) - tileCoord[2] - 1;
      return y.toString();
    });
}

function replaceUrlPlaceholders(baseUrl, config, options) {
  let url = baseUrl;
  const time = options.time || store.state.indicators.selectedTime;
  const indicator = options.indicator || store.state.indicators.selectedIndicator.indicator;
  const aoiID = options.aoiID || store.state.indicators.selectedIndicator.aoiID;
  url = url.replace(/{time}/i, config.dateFormatFunction(time));
  url = url.replace(/{indicator}/gi, indicator);
  url = url.replace(/{aoiID}/gi, aoiID);
  if (config.features && config.features.dateFormatFunction) {
    url = url.replace(/{featuresTime}/i, config.features.dateFormatFunction(time));
  }
  if (config.siteMapping) {
    const currSite = config.siteMapping(aoiID);
    url = url.replace(/{site}/gi, currSite);
  }
  return url;
}

/**
 * generate a layer from a given config Object
 * @param {Object} config eodash config object
 *
 * layer definitions via config
 * @param {string} config.style.fillColor fill color
 * @param {number} config.style.weight stroke weight
 * @param {string} config.style.color stroke color
 * @param {Object} [opt_options={}] options
 * @param {number} [opt_options.zIndex=0] optional zIndex, defaults to 0
 * @param {boolean} [opt_options.updateOpacityOnZoom=false] sets the updateOpacityOnZoom-flag
 * on the layer. this can be used inside components to update opacity
 * for overlays like labels or borders. Defaults to false.
 * @param {*} [opt_options.time=undefined] optional time.
 * @param {*} [opt_options.indicator=undefined] optional indicator. (e.g. "E13b")
 * @param {*} [opt_options.aoiID=undefined] optional aoiID.
 * @param {*} [opt_options.drawnArea=undefined] optional drawnArea object.
 * if not set, time will be retrieved from the store
 * @returns {Group} returns ol layer
 */
// eslint-disable-next-line import/prefer-default-export
export function createLayerFromConfig(config, _options = {}) {
  const options = { ..._options };
  options.zIndex = options.zIndex || 0;
  options.updateOpacityOnZoom = options.updateOpacityOnZoom || false;

  // layers created by this config. These Layers will get combined into a single ol.layer.Group
  const layers = [];
  if (config.protocol === 'cog') {
    let updatedSources = config.sources;
    if (config.usedTimes?.time?.length) {
      const currentTime = config.usedTimes.time[config.usedTimes.time.length - 1];
      updatedSources = config.sources.map((item) => {
        const url = item.url.replace(/{time}/i, config.dateFormatFunction(currentTime));
        return { url };
      });
    }
    const source = new GeoTIFF({
      sources: updatedSources,
      normalize: config.normalize ? config.normalize : false,
    });
    const wgTileLayer = new WebGLTileLayer({
      source,
      style: config.style,
    });
    wgTileLayer.set('id', config.id);
    layers.push(wgTileLayer);
  }
  if (config.protocol === 'vectortile') {
    const tilelayer = new VectorTileLayer();
    tilelayer.set('id', config.id);
    applyStyle(tilelayer, config.styleFile, [config.selectedStyleLayer]);
    layers.push(tilelayer);
  }
  if (config.protocol === 'vectorgeojson') {
    const layer = new VectorLayer();
    layer.set('id', config.id);
    layer.set('name', config.name);
    layer.set('styleFile', config.styleFile);
    layer.set('selectedStyleLayer', config.selectedStyleLayer);
    layers.push(layer);
    fetch(config.styleFile).then((r) => r.json())
      .then((glStyle) => {
        const newGlStyle = JSON.parse(JSON.stringify(glStyle));
        let currentTime = '2022_09_17';
        if (config.usedTimes?.time?.length) {
          currentTime = config.usedTimes.time[config.usedTimes.time.length - 1];
          currentTime = currentTime.replaceAll('-', '_');
        }
        newGlStyle.sources.air_quality.data = newGlStyle.sources.air_quality.data.replace(
          '{{time}}', currentTime,
        );
        applyStyle(layer, newGlStyle, [config.selectedStyleLayer]);
      })
      .catch(() => console.log('Issue loading mapbox style'));
  }
  if (config.protocol === 'countries') {
    layers.push(new VectorLayer({
      name: 'Country vectors',
      source: countriesSource,
      updateOpacityOnZoom: options.updateOpacityOnZoom,
      zIndex: options.zIndex,
      style: new Style({
        fill: new Fill({
          color: '#fff',
        }),
        stroke: new Stroke({
          width: 1,
          color: '#a2a2a2',
        }),
      }),
    }));
  }
  if (config.protocol === 'GeoJSON') {
    // mutually exclusive options, either direct features or url to fetch
    const vectorSourceOpts = config.url ? {
      url: config.url,
      format: geoJsonFormat,
    } : {
      features: geoJsonFormat.readFeatures(config.data),
    };
    layers.push(new VectorLayer({
      name: config.name,
      zIndex: options.zIndex,
      updateOpacityOnZoom: false,
      source: new VectorSource(vectorSourceOpts),
      style: new Style({
        fill: new Fill({
          color: config.style.fillColor || 'rgba(0, 0, 0, 0.5)',
        }),
        stroke: new Stroke({
          width: config.style.weight || 3,
          color: config.style.color || 'rgba(0, 0, 0, 0.5)',
        }),
      }),
      maxZoom: config.maxZoom,
      minZoom: config.minZoom,
    }));
  }
  if (config.protocol === 'geoserverVectorTiles') {
    const geoserverUrl = 'https://xcube-geodb.brockmann-consult.de/geoserver/geodb_debd884d-92f9-4979-87b6-eadef1139394/gwc/service/tms/1.0.0/';
    const source = new VectorTileSource({
      projection: 'EPSG:3857',
      format: new MVT(),
      url: `${geoserverUrl}${config.layerName}@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf`,
    });
    layers.push(new VectorTileLayer({
      name: config.name,
      style: new Style({
        fill: new Fill({
          color: config.style.fillColor || 'rgba(0, 0, 0, 0.5)',
        }),
        stroke: new Stroke({
          width: config.style.weight || 1.5,
          color: config.style.color || 'rgba(0, 0, 0, 0.5)',
        }),
      }),
      source,
      maxZoom: config.maxZoom,
      minZoom: config.minZoom,
    }));
  }
  if (config.protocol === 'flatgeobuf') {
    const vectorSourceOpts = {
      format: geoJsonFormat,
      strategy: bbox,
    };
    const source = new VectorSource(vectorSourceOpts);
    // eslint-disable-next-line no-inner-declarations
    async function updateResults(extent, resolution, projection, success) {
      const rect = fgbBoundingBox(extent, projection);
      // Use flatgeobuf JavaScript API to iterate features as geojson.
      // Because we specify a bounding box, flatgeobuf will only fetch the relevant subset of data,
      // rather than the entire file.
      if (rect.minX !== -Infinity) {
        const ftrs = [];
        const iter = flatgeobuf.deserialize(config.url, rect);
        // eslint-disable-next-line no-restricted-syntax
        for await (const feature of iter) {
          const ftr = geoJsonFormat.readFeature(feature);
          ftrs.push(ftr);
        }
        source.clear();
        source.addFeatures(ftrs);
        success();
      }
    }
    source.setLoader(updateResults);
    layers.push(new VectorLayer({
      name: config.name,
      zIndex: options.zIndex,
      updateOpacityOnZoom: false,
      source,
      style: new Style({
        fill: new Fill({
          color: config.style.fillColor || 'rgba(0, 0, 0, 0.5)',
        }),
        stroke: new Stroke({
          width: config.style.weight || 3,
          color: config.style.color || 'rgba(0, 0, 0, 0.5)',
        }),
      }),
      maxZoom: config.maxZoom,
      minZoom: config.minZoom,
    }));
  }
  let source;
  if (config.protocol === 'xyz') {
    if (config.usedTimes?.time?.length) {
      // for layers with time entries, use a tileUrl function that
      // gets the current time entry from the store
      source = new XYZSource({
        attributions: config.attribution,
        maxZoom: config.maxZoom,
        minZoom: config.minZoom,
        crossOrigin: 'anonymous',
        transition: 0,
        tileUrlFunction: (tileCoord) => {
          const url = replaceUrlPlaceholders(config.url, config, options);
          return createFromTemplate(url, tileCoord);
        },
      });
      source.set('updateTime', (time, area, configUpdate) => {
        const updatedOptions = {
          ...options,
          ...configUpdate,
        };
        updatedOptions.time = time;
        source.setTileUrlFunction((tileCoord) => {
          const url = replaceUrlPlaceholders(configUpdate.url, configUpdate, updatedOptions);
          return createFromTemplate(url, tileCoord);
        });
      });
    } else {
      source = new XYZSource({
        attributions: config.attribution,
        maxZoom: config.maxZoom,
        minZoom: config.minZoom,
        crossOrigin: 'anonymous',
        transition: 0,
        tileUrlFunction: (tileCoord) => createFromTemplate(config.url, tileCoord),
      });
    }
  }
  if (config.protocol === 'WMS') {
    // to do: layers is  not defined for harvesting evolution over time (spain)
    const paramsToPassThrough = ['layers', 'STYLES', 'styles',
      'format', 'env', 'sld', 'exceptions'];
    const tileSize = config.combinedLayers?.length
      ? config.combinedLayers[0].tileSize : config.tileSize;
    const tileGrid = tileSize === 512 ? new TileGrid({
      extent: [-20037508.342789244, -20037508.342789244,
        20037508.342789244, 20037508.342789244],
      resolutions: createXYZ({
        tileSize: 512,
      }).getResolutions(),
      tileSize: 512,
    }) : undefined;

    // combined wms layers, for instance CMEMS Water Quality (RACE)
    // and Sea Ice Concentration (trilateral)
    if (config.combinedLayers?.length) {
      config.combinedLayers.forEach((c) => {
        const params = {};
        let extent;
        if (c.extent) {
          extent = transformExtent(c.extent, 'EPSG:4326', DEFAULT_PROJECTION);
        }

        paramsToPassThrough.forEach((param) => {
          if (typeof c[param] !== 'undefined') {
            params[param] = c[param];
          }
        });
        if (config.usedTimes?.time?.length) {
          params.time = c.dateFormatFunction(options.time);
          if (config.specialEnvTime) {
            params.env = `year:${params.time}`;
          }
        }
        const projection = c.projection || DEFAULT_PROJECTION;
        const singleSource = new TileWMS({
          attributions: config.attribution,
          maxZoom: c.maxZoom,
          minZoom: c.minZoom,
          crossOrigin: 'anonymous',
          transition: 0,
          projection: getProjectionOl(projection),
          params,
          url: c.baseUrl,
          tileGrid,
        });
        singleSource.set('updateTime', (updatedTime, area, configUpdate) => {
          const timeString = c.dateFormatFunction(updatedTime);
          const paramsUpdate = {};
          paramsToPassThrough.forEach((param) => {
            if (typeof configUpdate[param] !== 'undefined') {
              paramsUpdate[param] = configUpdate[param];
            }
          });
          const newParams = {
            ...paramsUpdate,
            time: timeString,
          };
          if (configUpdate.specialEnvTime) {
            newParams.env = `year:${updatedTime}`;
          }
          singleSource.updateParams(newParams);
        });
        layers.push(new TileLayer({
          name: config.name,
          updateOpacityOnZoom: options.updateOpacityOnZoom,
          zIndex: options.zIndex,
          source: singleSource,
          extent,
        }));
      });
    } else {
      const params = {};
      paramsToPassThrough.forEach((param) => {
        if (typeof config[param] !== 'undefined') {
          params[param] = config[param];
        }
      });
      if (config.usedTimes?.time?.length) {
        params.time = config.dateFormatFunction(options.time);
        if (config.specialEnvTime) {
          params.env = `year:${params.time}`;
        }
      }
      const projection = config.projection || DEFAULT_PROJECTION;
      source = new TileWMS({
        attributions: config.attribution,
        maxZoom: config.maxZoom,
        minZoom: config.minZoom,
        crossOrigin: 'anonymous',
        transition: 0,
        projection: getProjectionOl(projection),
        params,
        url: config.url || config.baseUrl,
        tileGrid,
      });
      source.set('updateTime', (updatedTime, area, configUpdate) => {
        const timeString = configUpdate.dateFormatFunction(updatedTime);
        const paramsUpdate = {};
        paramsToPassThrough.forEach((param) => {
          if (typeof configUpdate[param] !== 'undefined') {
            paramsUpdate[param] = configUpdate[param];
          }
        });
        const newParams = {
          ...paramsUpdate,
          time: timeString,
        };
        if (configUpdate.specialEnvTime) {
          newParams.env = `year:${updatedTime}`;
        }
        source.updateParams(newParams);
      });
    }
  }
  if (config.protocol === 'maplibre') {
    const layer = new MapLibreLayer({
      name: config.name,
      zIndex: options.zIndex,
      attribution: config.attribution,
      maplibreOptions: {
        style: config.maplibreStyles,
      },
    });
    layers.push(layer);
  }
  let extent;
  if (config.extent) {
    extent = transformExtent(
      config.extent, 'EPSG:4326',
      DEFAULT_PROJECTION,
    );
  }

  if (source) {
    layers.push(new TileLayer({
      name: config.name,
      updateOpacityOnZoom: options.updateOpacityOnZoom,
      zIndex: options.zIndex,
      source,
      extent,
    }));
  }

  if (config.features) {
    // some layers have a baselayer and GeoJSON features above them
    // e.g. "Ports and Shipping"
    const featuresSource = new VectorSource({
      features: [],
    });
    fetchData({
      usedTime: options.time,
      config,
      drawnArea: options.drawnArea,
      source: featuresSource,
    });
    // this gives an option to update the source (most likely the time) without
    // re-creating the entire layer
    const featuresUpdate = (time, drawnArea, configUpdate) => {
      const updatedOptions = {
        ...options,
        ...configUpdate,
      };
      updatedOptions.time = time;
      fetchData({
        usedTime: time,
        config: updatedOptions,
        drawnArea,
        source: featuresSource,
      });
    };
    featuresSource.set('updateTime', featuresUpdate);
    if (config.customAreaFeatures) {
      featuresSource.set('updateArea', featuresUpdate);
    }
    const fill = new Fill({
      color: 'rgba(255, 255, 255, 0.1)',
    });
    const stroke = new Stroke({
      width: 2,
      color: '#F7A400',
    });
    const featuresLayer = new VectorLayer({
      source: featuresSource,
      name: `${config.name}_features`,
      style: new Style({
        fill,
        stroke,
        image: new Circle({
          fill,
          stroke,
          radius: 4,
        }),
      }),
    });

    layers.push(featuresLayer);
  }

  return new Group({
    name: config.name,
    visible: config.visible,
    updateOpacityOnZoom: options.updateOpacityOnZoom,
    zIndex: options.zIndex,
    layers,
  });
}
