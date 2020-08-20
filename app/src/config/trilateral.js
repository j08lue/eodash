// config global variables here for now
// temporary solution
import { Wkt } from 'wicket';
import { latLng, latLngBounds } from 'leaflet';
import { DateTime } from 'luxon';
import { shTimeFunction } from '@/utils';

export const dataPath = './data/internal/';
export const dataEndpoints = [
  {
    type: 'eox',
    provider: './data/internal/pois_trilateral.json',
  },
  /*
  {
    type: 'nasa',
    provider: 'https://h4ymwpefng.execute-api.us-east-1.amazonaws.com/v1/',
  },
  {
    type: 'nasa',
    provider: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/',
  },
  */
];

export const indicatorsDefinition = Object.freeze({
  E1: {
    indicator: 'Status of metallic ores',
    class: 'economic',
    file: './data/trilateral/E1.csv',
    story: '/data/trilateral/E1',
  },
  E1a: {
    indicator: 'Status of non-metallic ores',
    class: 'economic',
    file: './data/trilateral/E1a.csv',
    story: '/data/trilateral/E1a',
  },
  E2: {
    indicator: 'Volume of oil stockpiled',
    class: 'economic',
  },
  E2a: {
    indicator: 'Level of flaring activity',
    class: 'economic',
  },
  E3: {
    indicator: 'Inventory levels of factory inputs',
    class: 'economic',
  },
  E4: {
    indicator: 'Production activity of intermediate goods',
    class: 'economic',
  },
  E5: {
    indicator: 'Inventory levels of intermediate goods',
    class: 'economic',
  },
  E6: {
    indicator: 'Inventory levels of factory inputs',
    class: 'economic',
  },
  E7: {
    indicator: 'Production activity of finished goods',
    class: 'economic',
  },
  E8: {
    indicator: 'Inventory Levels',
    class: 'economic',
    file: './data/trilateral/E8.csv',
    story: '/data/trilateral/E8_tri',
    largeSubAoi: true,
  },
  E9: {
    indicator: 'Construction activity',
    class: 'economic',
    file: './data/trilateral/E9.csv',
    story: '/data/trilateral/E9',
    largeSubAoi: true,
  },
  E10a1: {
    indicator: 'Harvesting activity',
    class: 'agriculture',
    file: './data/trilateral/E10a1.csv',
    story: '/data/trilateral/E10a1',
    largeSubAoi: true,
  },
  E10a2: {
    indicator: 'Cum. proportion of total area under active mgmt.',
    class: 'agriculture',
    file: './eodash-data/data/E10a2.csv',
    story: '/eodash-data/stories/E10a2',
    largeSubAoi: true,
  },
  E10a3: {
    indicator: 'Evolution of the cultivated areas for production of white asparagus',
    class: 'agriculture',
    file: './eodash-data/data/E10a3.csv',
    story: '/eodash-data/stories/E10a2',
    largeSubAoi: true,
  },
  E10a6: {
    indicator: 'Harvested parcels evolution over time',
    class: 'agriculture',
    file: './eodash-data/data/E10a6.csv',
    story: '/eodash-data/stories/E10a6',
    largeSubAoi: true,
  },
  E10a7: {
    indicator: 'Harvested area evolution over time',
    class: 'agriculture',
    file: './eodash-data/data/E10a7.csv',
    story: '/eodash-data/stories/E10a7',
    largeSubAoi: true,
  },
  E10a8: {
    indicator: 'Cumulative harvested area',
    class: 'agriculture',
    file: './eodash-data/data/E10a8.csv',
    story: '/eodash-data/stories/E10a8',
    largeSubAoi: true,
  },
  E10b: {
    indicator: 'Field preparation activity',
    class: 'agriculture',
  },
  E10c: {
    indicator: 'Rice Planted Area',
    class: 'agriculture',
    file: './data/trilateral/E10c.csv',
    story: '/data/trilateral/US05-E10c',
    largeSubAoi: true,
  },
  E10d: {
    indicator: 'Cropped Area - Regional',
    class: 'agriculture',
    story: '/data/trilateral/E10d',
    largeSubAoi: true,
  },
  E11: {
    indicator: 'Volume of activity at shopping centers',
    class: 'economic',
  },
  E12a: {
    indicator: 'Volume of activity logistic interchange centers',
    class: 'economic',
  },
  E12b: {
    indicator: 'Throughput at border crossing points',
    class: 'economic',
  },
  E13a: {
    indicator: 'Throughput at principal rail stations',
    class: 'economic',
  },
  E13b: {
    indicator: 'Throughput at principal hub airports',
    class: 'economic',
    file: './data/trilateral/E13b.csv',
    story: '/data/trilateral/JP01-E13b',
    largeSubAoi: true,
  },
  E13c: {
    indicator: 'Number of Ships in Port',
    class: 'economic',
    file: './data/trilateral/E13c.csv',
    story: '/data/trilateral/E13c',
    largeSubAoi: true,
  },
  H1: {
    indicator: 'Number of temp. treatment sites',
    class: 'health',
  },
  N1: {
    indicator: 'Air quality',
    class: 'environment',
    file: './data/trilateral/N1.csv',
    story: '/data/trilateral/N1',
    largeTimeDuration: true,
    largeSubAoi: true,
  },
  NASAPopulation: {
    indicator: 'Population',
    class: 'economic',
  },
  N2: {
    indicator: 'Greenhouse Gases',
    class: 'environment',
    file: './data/trilateral/N2.csv',
    story: '/data/trilateral/N2',
    largeTimeDuration: true,
    largeSubAoi: true,
  },
  N3: {
    indicator: 'Water Quality',
    class: 'environment',
  },
  N3b: {
    indicator: 'Chl-a concentration anomaly',
    class: 'environment',
    file: './data/trilateral/N3b.csv',
    story: '/data/trilateral/N3b',
  },
  N3a2: {
    indicator: 'CHL concentration',
    class: 'environment',
    story: '/eodash-data/stories/N3a2',
    largeSubAoi: true,
  },
  N4a: {
    indicator: 'Changes in land fill sites',
    class: 'environment',
  },
  N4b: {
    indicator: 'Illegal waste levels',
    class: 'environment',
  },
  N5: {
    indicator: 'Nightlights (Suomi NPP VIIRS)',
    class: 'economic',
    story: '/data/trilateral/N5',
    largeSubAoi: true,
  },
  N6: {
    indicator: 'Cropped Area - Global',
    class: 'agriculture',
    story: '/data/trilateral/N6',
  },
  d: { // dummy for locations without Indicator code
    indicator: 'Upcoming data',
    class: 'economic',
  },
});

export const layerNameMapping = Object.freeze({
  // "inputdata" -> wms layer name and baseurl
  '[NEW] Planetscope COVID-19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLANETSCOPE_COVID-19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  'PlanetScope - COVID19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLANETSCOPE_COVID-19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  'Planetscope COVID-19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLANETSCOPE_COVID-19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  '[NEW] Planet COVID-19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLANETSCOPE_COVID-19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  '[NEW] Pleiades': {
    baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  'Pleiades - COVID19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_COVID19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  '[NEW] Pleiades COVID-19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_COVID19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  '[NEW] Pleiades COVID19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_COVID19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  // 'DS_PHR1A': {
  //   base`rl: 'https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
  //   layers: 'NEW_PLEIADES_COVID19',
  // },
  '[NEW] Pleiades - 2.8m - COVID19': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_28_COVID19',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  '[NEW] Pleiades 16bit': {
    baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'NEW_PLEIADES_16BIT',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  'Sentinel 2 L2A': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'SENTINEL-2-L2A-TRUE-COLOR',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  S2L2A: {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'SENTINEL-2-L2A-TRUE-COLOR',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  S1GRD: {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'E8_SENTINEL1',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  'S1A - GRD': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'E8_SENTINEL1',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  'LANDSAT-8-TRUE-COLOUR': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'LANDSAT-8-TRUE-COLOUR',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  'LANDSAT-8-NIR': {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
    layers: 'LANDSAT-8-NIR',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  },
  N1: {
    maxMapZoom: 8,
  },
  NASAPopulation: {
    maxMapZoom: 8,
  },
  'ALOS-2': {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2FALOS_SAMPLE%2Falos2-s1-beijing_{time}.tif&resampling_method=nearest&bidx=1&rescale=0%2C65536',
    protocol: 'xyz',
    tileSize: 256,
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
  },
  GOSAT_XCO2: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/xco2/GOSAT_XCO2_{time}_{site}_BG_circle_cog.tif&resampling_method=nearest',
    protocol: 'xyz',
    maxNativeZoom: 12,
    maxMapZoom: 12,
    tileSize: 256,
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMM'),
    siteMapping: (eoID) => {
      const mapping = {
        CN01: 'be',
        CN02: 'sh',
        BD01: 'dh',
        IN01: 'dl',
        IN02: 'mb',
        US01: 'ny',
        JP01: 'tk',
      };
      return mapping[eoID];
    },
    legendUrl: 'data/trilateral/N2-XCO2-legend.png',
  },
  airport_tk: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fairport%2Ftk_{time}.tif&resampling_method=bilinear&bidx=1',
    protocol: 'xyz',
    tileSize: 256,
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
  },
  industry: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Findustry%2F{site}_{time}.tif&resampling_method=bilinear&bidx=1',
    protocol: 'xyz',
    tileSize: 256,
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
    siteMapping: (eoID) => {
      const mapping = {
        SG01: 'sg',
        JP03: 'tk',
      };
      return mapping[eoID];
    },
  },
  ports: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fplanet%2F{site}-{time}.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
    protocol: 'xyz',
    tileSize: 256,
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
    siteMapping: (eoID) => {
      const mapping = {
        US01: 'ny',
        US02: 'la',
        US03: 'sf',
      };
      return mapping[eoID];
    },
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
      url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/detections/ship/{site}/{featuresTime}.geojson',
      parameters: { // can also be a simple list
        verified: {},
      },
    },
  },
  'SGLI L2 Reflectance 8-day composited': {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fagriculture%2Fgcom-c-{time}.tif&resampling_method=bilinear&bidx=1&rescale=0%2C1&color_map=cfastie',
    protocol: 'xyz',
    tileSize: 256,
    legendUrl: 'data/trilateral/NDVI.png',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
  },
  N5: {
    maxMapZoom: 15,
  },
  N2limited: {
    maxMapZoom: 5,
  },
});

export const indicatorClassesIcons = Object.freeze({
  environment: 'mdi-earth',
  health: 'mdi-hospital-box-outline',
  agriculture: 'mdi-leaf',
  economic: 'mdi-cash',
});

export const mapDefaults = Object.freeze({
  minMapZoom: 0,
  maxMapZoom: 18,
  bounds: latLngBounds(latLng([-70, -170]), latLng([70, 170])),
});

export const baseLayers = [
  {
    name: 'EOxCloudless 2019',
    url: '//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2019_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ EOxCloudless 2019: <a xmlns:dct="http://purl.org/dc/terms/" href="//s2maps.eu" target="_blank" property="dct:title">Sentinel-2 cloudless - s2maps.eu</a> by <a xmlns:cc="http://creativecommons.org/ns#" href="//eox.at" target="_blank" property="cc:attributionName" rel="cc:attributionURL">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2019) }',
    visible: false,
    maxNativeZoom: 15,
  },
  {
    name: 'Terrain light',
    url: '//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ Terrain light: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors and <a href="//maps.eox.at/#data" target="_blank">others</a>, Rendering &copy; <a href="http://eox.at" target="_blank">EOX</a> }',
    maxNativeZoom: 16,
    visible: true,
  },
];
export const overlayLayers = [
  {
    name: 'Overlay',
    url: '//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ Overlay: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, Made with Natural Earth, Rendering &copy; <a href="//eox.at" target="_blank">EOX</a> }',
    visible: true,
    maxZoom: 14,
  },
];

export const defaultWMSDisplay = {
  baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
  protocol: 'WMS',
  dateFormatFunction: shTimeFunction,
  format: 'image/png',
  transparent: true,
  tileSize: 512,
  opacity: 1,
  attribution: 'attributiontextplaceholder',
  minZoom: 7,
};

const getMonthlyDates = (start, end) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end);
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push(DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd'));
    currentDate = DateTime.fromISO(currentDate).plus({ months: 1 });
  }
  return dateArray;
};

const getDailyDates = (start, end) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end);
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push(DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd'));
    currentDate = DateTime.fromISO(currentDate).plus({ days: 1 });
  }
  return dateArray;
};

const getWeeklyDates = (start, end) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end);
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push(DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd'));
    currentDate = DateTime.fromISO(currentDate).plus({ weeks: 1 });
  }
  return dateArray;
};

const getFortnightIntervalDates = (start, end) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end).minus({ weeks: 2 });
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push([
      DateTime.fromISO(currentDate).toFormat('yyyy-MM-dd'),
      DateTime.fromISO(currentDate).plus({ weeks: 2 }).toFormat('yyyy-MM-dd'),
    ]);
    currentDate = DateTime.fromISO(currentDate).plus({ weeks: 1 });
  }
  return dateArray;
};

const wkt = new Wkt();

export const globalIndicators = [
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Air Quality',
        indicator: 'N1',
        lastIndicatorValue: 'TROPOMI: Nitrogen dioxide',
        indicatorName: 'Air Quality - TROPOMI: NO2',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        lastColorCode: 'primary',
        externalData: {
          label: 'Sentinel-5p Mapping Service',
          url: 'https://maps.s5p-pal.com',
        },
        aoi: null,
        aoiID: 'W1',
        time: getFortnightIntervalDates('2019-01-07', '2020-08-10'),
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 6,
          opacity: 1,
          url: '//obs.eu-de.otc.t-systems.com/s5p-pal-l3-tms/s5p-l3-tropno2/fortnight/{time}/{z}/{x}/{-y}.png',
          name: 'Air Quality (NO2) - ESA',
          legendUrl: 'eodash-data/data/no2Legend.png',
          attribution: '{ Air Quality: <a href="//scihub.copernicus.eu/twiki/pub/SciHubWebPortal/TermsConditions/TC_Sentinel_Data_31072014.pdf" target="_blank">Sentinel data</a>, <a href="//maps.s5p-pal.com/" target="_blank">S5P-PAL</a> }',
          dateFormatFunction: (dates) => `${DateTime.fromISO(dates[0]).toFormat('yyyyMMdd')}-${DateTime.fromISO(dates[1]).toFormat('yyyyMMdd')}`,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Air Quality',
        indicator: 'N1',
        lastIndicatorValue: 'OMI: Nitrogen dioxide',
        indicatorName: 'Air Quality - OMI: NO2',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        lastColorCode: 'primary',
        aoi: null,
        aoiID: 'W2',
        time: getMonthlyDates('2004-10-01', '2020-07-01'),
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 6,
          opacity: 0.7,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x.png?url=s3://covid-eo-data/OMNO2d_HRM/OMI_trno2_0.10x0.10_{time}_Col3_V4.nc.tif&resampling_method=bilinear&bidx=1&rescale=0%2C1.8e16&color_map=reds',
          name: 'Air Quality (NASA)',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMM'),
          legendUrl: 'eodash-data/data/no2Legend.png',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Greenhouse Gases',
        indicator: 'N2',
        lastIndicatorValue: 'OCO-2: Mean CO2',
        indicatorName: 'Greenhouse Gases - OCO-2: Mean CO2',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        lastColorCode: 'primary',
        aoi: null,
        aoiID: 'W3',
        time: getDailyDates('2020-01-01', '2020-05-17'),
        inputData: [''],
        display: {
          protocol: 'xyz',
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/xco2/xco2_15day_mean.{time}.tif&resampling_method=bilinear&bidx=1&rescale=0.000408%2C0.000419&color_map=rdylbu_r',
          name: 'Greenhouse Gases (NASA)',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          legendUrl: 'data/trilateral/N2-co2mean-legend.png',
          mapLabel: 'Mean',
        },
        compareDisplay: {
          protocol: 'xyz',
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/xco2/xco2_15day_base.{time}.tif&resampling_method=bilinear&bidx=1&rescale=0.000408%2C0.000419&color_map=rdylbu_r',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          mapLabel: 'Baseline',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Greenhouse Gases',
        indicator: 'N2',
        lastIndicatorValue: 'OCO-2: Difference CO2',
        indicatorName: 'Greenhouse Gases - OCO-2: Difference CO2',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        lastColorCode: 'primary',
        aoi: null,
        aoiID: 'W5',
        time: getDailyDates('2020-01-01', '2020-05-17'),
        inputData: [''],
        display: {
          protocol: 'xyz',
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/xco2/xco2_15day_diff.{time}.tif&resampling_method=bilinear&bidx=1&rescale=-0.000001%2C0.000001&color_map=rdbu_r',
          name: 'Greenhouse Gases (NASA)',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          legendUrl: 'data/trilateral/N2-co2diff-legend.png',
          disableCompare: true,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Population',
        indicator: 'NASAPopulation',
        lastIndicatorValue: 'normal',
        indicatorName: 'Population density 2020',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: 'primary',
        aoi: null,
        aoiID: 'W6',
        time: ['2020-05-14T00:00:00Z'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 6,
          opacity: 1,
          url: 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GPW_Population_Density_2020/default/{time}/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png',
          name: 'Population',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
          legendUrl: 'data/trilateral/NASAPopulation_legend.png',
          disableCompare: true,
        },
      },
    },
  },
  {
    latlng: latLng([35.61, 139.78]),
    id: 9998,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([35.61, 139.78]),
        id: 9998,
        aoiID: 'JP01',
        country: ['JP'],
        city: 'Tokyo',
        siteName: 'Tokyo',
        description: 'Nightlights',
        indicator: 'N5',
        lastIndicatorValue: 'normal',
        indicatorName: 'Night light composite maps (Suomi NPP VIIRS)',
        lastColorCode: 'BLUE',
        eoSensor: Array(7).fill(['Nightlights']),
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((139.34275817871094 35.049654646456474, 140.34809152322123 35.049654646456474, 140.34809152322123 35.93543243408203, 139.34275817871094 35.93543243408203, 139.34275817871094 35.049654646456474))').toJson(),
          }],
        },
        time: [['202001'], ['202002'], ['202003'], ['202004'], ['202005'], ['202006'], ['202007']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/BMHD_30M_MONTHLY/BMHD_VNP46A2_tk_{time}_cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
          name: 'Nightlights',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          legendUrl: 'data/trilateral/N5-nighlights-legend.png',
        },
      },
    },
  },
  {
    latlng: latLng([39.9, 116.38]),
    id: 9997,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([39.9, 116.38]),
        id: 9997,
        aoiID: 'CN01',
        country: ['CN'],
        city: 'Beijing',
        siteName: 'Beijing',
        description: 'Nightlights',
        indicator: 'N5',
        lastIndicatorValue: 'normal',
        indicatorName: 'Night light composite maps (Suomi NPP VIIRS)',
        lastColorCode: 'BLUE',
        eoSensor: Array(7).fill(['Nightlights']),
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((115.91229248046875 39.627200509676186, 116.86084804657003 39.627200509676186, 116.86084804657003 40.32575607299805, 115.91229248046875 40.32575607299805, 115.91229248046875 39.627200509676186,))').toJson(),
          }],
        },
        time: [['202001'], ['202002'], ['202003'], ['202004'], ['202005'], ['202006'], ['202007']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/BMHD_30M_MONTHLY/BMHD_VNP46A2_be_{time}_cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
          name: 'Nightlights',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          legendUrl: 'data/trilateral/N5-nighlights-legend.png',
        },
      },
    },
  },
  {
    latlng: latLng([51.036138, 2.285374]),
    id: 9996, // for now
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([51.036138, 2.285374]),
        id: 9996,
        aoiID: 'FR03',
        country: ['FR'],
        city: 'Port of Dunkirk',
        siteName: 'Port of Dunkirk',
        description: 'Nightlights',
        indicator: 'N5',
        lastIndicatorValue: 'normal',
        indicatorName: 'Night light composite maps (Suomi NPP VIIRS)',
        lastColorCode: 'BLUE',
        eoSensor: Array(7).fill(['Nightlights']),
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((2.083559989929199 50.965508184133796, 2.416559993631381 50.965508184133796, 2.416559993631381 51.087730407714844, 2.083559989929199 51.087730407714844, 2.083559989929199 50.965508184133796))').toJson(),
          }],
        },
        time: [['202001'], ['202002'], ['202003'], ['202004'], ['202005'], ['202006'], ['202007']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/BMHD_30M_MONTHLY/BMHD_VNP46A2_du_{time}_cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
          name: 'Nightlights',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          legendUrl: 'data/trilateral/N5-nighlights-legend.png',
        },
      },
    },
  },
  {
    latlng: latLng([51.091559, 3.740081]),
    id: 9995,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([51.091559, 3.740081]),
        id: 9995,
        aoiID: 'BE03',
        country: ['BE'],
        city: 'Port of Ghent',
        siteName: 'Port of Ghent',
        description: 'Nightlights',
        indicator: 'N5',
        lastIndicatorValue: 'normal',
        indicatorName: 'Night light composite maps (Suomi NPP VIIRS)',
        lastColorCode: 'BLUE',
        eoSensor: Array(7).fill(['Nightlights']),
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((3.6453969478607178 51.06661950775742, 3.85839695022878 51.06661950775742, 3.85839695022878 51.28873062133789, 3.6453969478607178 51.28873062133789, 3.6453969478607178 51.06661950775742))').toJson(),
          }],
        },
        time: [['202001'], ['202002'], ['202003'], ['202004'], ['202005'], ['202006'], ['202007']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/BMHD_30M_MONTHLY/BMHD_VNP46A2_gh_{time}_cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
          name: 'Nightlights',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          legendUrl: 'data/trilateral/N5-nighlights-legend.png',
        },
      },
    },
  },
  {
    latlng: latLng([34.05, -118.25]),
    id: 9994,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([34.05, -118.25]),
        id: 9994,
        aoiID: 'US02',
        country: ['US'],
        city: 'Los Angeles',
        siteName: 'Los Angeles',
        description: 'Nightlights',
        indicator: 'N5',
        lastIndicatorValue: 'normal',
        indicatorName: 'Night light composite maps (Suomi NPP VIIRS)',
        lastColorCode: 'BLUE',
        eoSensor: Array(7).fill(['Nightlights']),
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-118.68741607666016 33.42670324365463, -117.0733049476039 33.42670324365463, -117.0733049476039 34.34392547607422, -118.68741607666016 34.34392547607422, -118.68741607666016 33.42670324365463))').toJson(),
          }],
        },
        time: [['202001'], ['202002'], ['202003'], ['202004'], ['202005'], ['202006'], ['202007']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/BMHD_30M_MONTHLY/BMHD_VNP46A2_la_{time}_cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
          name: 'Nightlights',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          legendUrl: 'data/trilateral/N5-nighlights-legend.png',
        },
      },
    },
  },
  {
    latlng: latLng([37.7775, -122.416389]),
    id: 9993,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([37.7775, -122.416389]),
        id: 9993,
        aoiID: 'US03',
        country: ['US'],
        city: 'San Francisco',
        siteName: 'San Francisco',
        description: 'Nightlights',
        indicator: 'N5',
        lastIndicatorValue: 'normal',
        indicatorName: 'Night light composite maps (Suomi NPP VIIRS)',
        lastColorCode: 'BLUE',
        eoSensor: Array(7).fill(['Nightlights']),
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.63569641113281 37.119795894876006, -121.53514084334165 37.119795894876006, -121.53514084334165 38.35512924194336, -122.63569641113281 38.35512924194336, -122.63569641113281 37.119795894876006))').toJson(),
          }],
        },
        time: [['202001'], ['202002'], ['202003'], ['202004'], ['202005'], ['202006'], ['202007']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/BMHD_30M_MONTHLY/BMHD_VNP46A2_sf_{time}_cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
          name: 'Nightlights',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          legendUrl: 'data/trilateral/N5-nighlights-legend.png',
        },
      },
    },
  },
  {
    latlng: latLng([41.0114, -73.09]),
    id: 9992,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([41.0114, -73.09]),
        id: 9992,
        aoiID: 'US04',
        country: ['US'],
        city: 'New York',
        siteName: 'New York',
        description: 'Nightlights',
        indicator: 'N5',
        lastIndicatorValue: 'normal',
        indicatorName: 'Night light composite maps (Suomi NPP VIIRS)',
        lastColorCode: 'BLUE',
        eoSensor: Array(7).fill(['Nightlights']),
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-71.74516 41.54467, -74.43395 41.54943, -74.43219 40.47812, -71.74516 40.48343, -71.74516 41.54467))').toJson(),
          }],
        },
        time: [['202001'], ['202002'], ['202003'], ['202004'], ['202005'], ['202006'], ['202007']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/BMHD_30M_MONTHLY/BMHD_VNP46A2_ny_{time}_cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
          name: 'Nightlights',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          legendUrl: 'data/trilateral/N5-nighlights-legend.png',
        },
      },
    },
  },
  {
    id: 19999,
    latlng: latLng([45.197522, 13.029785]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 19999,
        aoi: latLng([45.197522, 13.029785]),
        aoiID: 'NorthAdriaticESA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic (ESA) - Chlorophyll-a concentration',
        siteName: 'North Adriatic',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (ESA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((13.82676706185932 44.707877452151976,13.826080416351507 44.63853985102104,13.828140352874945 44.60726198073148,13.830543612152288 44.580858170237136,13.824707125335882 44.56324896519081,13.831230257660101 44.53388844187968,13.83226022592182 44.50059527839493,13.14012155404682 44.49471803960046,12.29417428842182 44.482961784844655,12.22825631967182 44.70494937295371,12.28318796029682 44.82439215066662,12.375198458343695 44.80027974205457,12.408844088226507 44.82134821071279,12.466865633636663 44.848433626253936,12.50840768685932 44.941643892166006,12.435623263031195 44.97274112720852,12.430816744476507 45.017413877251585,12.314430330902288 44.96496839839778,12.346874331146429 45.11150096790739,12.3191510187685 45.20785209529116,12.239371393829535 45.20857774137082,12.210467909485052 45.2901538238102,12.22276315560932 45.377400919461266,12.30790719857807 45.48533806813408,12.48368844857807 45.559425118958345,12.622390841156195 45.527685472129804,12.436309908539007 45.47089417163262,12.428413485199163 45.41838351593179,12.782894228607367 45.546202443810486,12.887307261139105 45.60069590187233,12.977987383514593 45.62249048564204,13.101626490265081 45.63083382762503,13.086563204437445 45.72456591874726,13.210159395843695 45.76864898557,13.344055269867132 45.73942388451784,13.406883333831976 45.72384688466227,13.44499215951557 45.67565051875911,13.56034860482807 45.78397406598729,13.65647897592182 45.76194293851278,13.773208712249945 45.66413479361571,13.71965036264057 45.5603866467064,13.48619088998432 45.44295880636075,13.59605417123432 45.16671702535331,13.71690378060932 44.97954140088225,13.778701876312445 44.951120616125884,13.81852731576557 44.86042018307063,13.82402047982807 44.77737580152348,13.82676706185932 44.707877452151976))').toJson(),
          }],
        },
        time: getWeeklyDates('2020-01-07', '2020-08-11'),
        inputData: [''], // just for enabling eo data button for now
        display: {
          ...defaultWMSDisplay,
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceIdTrilateral}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM_TRILATERAL',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral.png',
          maxZoom: 13,
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    latlng: latLng([45.197522, 13.0297851]),
    id: 19998,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([45.197522, 13.0297851]),
        id: 19998,
        aoiID: 'NorthAdriaticNASA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic (NASA) - Chlorophyll-a concentration',
        siteName: 'North Adriatic',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (NASA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((13.82676706185932 44.707877452151976,13.826080416351507 44.63853985102104,13.828140352874945 44.60726198073148,13.830543612152288 44.580858170237136,13.824707125335882 44.56324896519081,13.831230257660101 44.53388844187968,13.83226022592182 44.50059527839493,13.14012155404682 44.49471803960046,12.29417428842182 44.482961784844655,12.22825631967182 44.70494937295371,12.28318796029682 44.82439215066662,12.375198458343695 44.80027974205457,12.408844088226507 44.82134821071279,12.466865633636663 44.848433626253936,12.50840768685932 44.941643892166006,12.435623263031195 44.97274112720852,12.430816744476507 45.017413877251585,12.314430330902288 44.96496839839778,12.346874331146429 45.11150096790739,12.3191510187685 45.20785209529116,12.239371393829535 45.20857774137082,12.210467909485052 45.2901538238102,12.22276315560932 45.377400919461266,12.30790719857807 45.48533806813408,12.48368844857807 45.559425118958345,12.622390841156195 45.527685472129804,12.436309908539007 45.47089417163262,12.428413485199163 45.41838351593179,12.782894228607367 45.546202443810486,12.887307261139105 45.60069590187233,12.977987383514593 45.62249048564204,13.101626490265081 45.63083382762503,13.086563204437445 45.72456591874726,13.210159395843695 45.76864898557,13.344055269867132 45.73942388451784,13.406883333831976 45.72384688466227,13.44499215951557 45.67565051875911,13.56034860482807 45.78397406598729,13.65647897592182 45.76194293851278,13.773208712249945 45.66413479361571,13.71965036264057 45.5603866467064,13.48619088998432 45.44295880636075,13.59605417123432 45.16671702535331,13.71690378060932 44.97954140088225,13.778701876312445 44.951120616125884,13.81852731576557 44.86042018307063,13.82402047982807 44.77737580152348,13.82676706185932 44.707877452151976))').toJson(),
          }],
        },
        time: [['2020-01-01'], ['2020-01-08'], ['2020-01-15'], ['2020-01-22'], ['2020-01-29'], ['2020-02-05'], ['2020-02-12'], ['2020-02-19'], ['2020-02-26'], ['2020-03-04'], ['2020-03-11'], ['2020-03-18'], ['2020-03-25'], ['2020-04-01'], ['2020-04-08'], ['2020-04-15'], ['2020-04-22'], ['2020-04-29'], ['2020-05-06'], ['2020-05-13'], ['2020-05-20'], ['2020-05-27'], ['2020-06-03'], ['2020-06-10'], ['2020-06-17'], ['2020-06-24'], ['2020-07-01'], ['2020-07-08'], ['2020-07-15'], ['2020-07-22'], ['2020-07-29']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-nas-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    latlng: latLng([45.197522, 13.0297851]),
    id: 19994,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([45.197522, 13.0297851]),
        id: 19994,
        aoiID: 'NorthAdriaticJAXA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic (JAXA) - Chlorophyll-a concentration',
        siteName: 'North Adriatic',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (JAXA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((13.82676706185932 44.707877452151976,13.826080416351507 44.63853985102104,13.828140352874945 44.60726198073148,13.830543612152288 44.580858170237136,13.824707125335882 44.56324896519081,13.831230257660101 44.53388844187968,13.83226022592182 44.50059527839493,13.14012155404682 44.49471803960046,12.29417428842182 44.482961784844655,12.22825631967182 44.70494937295371,12.28318796029682 44.82439215066662,12.375198458343695 44.80027974205457,12.408844088226507 44.82134821071279,12.466865633636663 44.848433626253936,12.50840768685932 44.941643892166006,12.435623263031195 44.97274112720852,12.430816744476507 45.017413877251585,12.314430330902288 44.96496839839778,12.346874331146429 45.11150096790739,12.3191510187685 45.20785209529116,12.239371393829535 45.20857774137082,12.210467909485052 45.2901538238102,12.22276315560932 45.377400919461266,12.30790719857807 45.48533806813408,12.48368844857807 45.559425118958345,12.622390841156195 45.527685472129804,12.436309908539007 45.47089417163262,12.428413485199163 45.41838351593179,12.782894228607367 45.546202443810486,12.887307261139105 45.60069590187233,12.977987383514593 45.62249048564204,13.101626490265081 45.63083382762503,13.086563204437445 45.72456591874726,13.210159395843695 45.76864898557,13.344055269867132 45.73942388451784,13.406883333831976 45.72384688466227,13.44499215951557 45.67565051875911,13.56034860482807 45.78397406598729,13.65647897592182 45.76194293851278,13.773208712249945 45.66413479361571,13.71965036264057 45.5603866467064,13.48619088998432 45.44295880636075,13.59605417123432 45.16671702535331,13.71690378060932 44.97954140088225,13.778701876312445 44.951120616125884,13.81852731576557 44.86042018307063,13.82402047982807 44.77737580152348,13.82676706185932 44.707877452151976))').toJson(),
          }],
        },
        time: [['2018-01-20'], ['2018-01-27'], ['2018-03-17'], ['2018-03-24'], ['2018-03-31'], ['2018-04-07'], ['2018-04-14'], ['2018-04-21'], ['2018-04-28'], ['2018-05-05'], ['2018-05-12'], ['2018-05-19'], ['2018-05-26'], ['2018-06-02'], ['2018-06-09'], ['2018-06-16'], ['2018-06-23'], ['2018-06-30'], ['2018-07-07'], ['2018-07-14'], ['2018-07-21'], ['2018-07-28'], ['2018-08-04'], ['2018-08-11'], ['2018-08-18'], ['2018-08-25'], ['2018-09-01'], ['2018-09-08'], ['2018-09-15'], ['2018-09-22'], ['2018-09-29'], ['2018-10-06'], ['2018-10-13'], ['2018-10-20'], ['2018-10-27'], ['2018-11-03'], ['2018-11-17'], ['2018-12-01'], ['2018-12-08'], ['2018-12-15'], ['2018-12-29'], ['2019-01-05'], ['2019-01-12'], ['2019-01-19'], ['2019-01-26'], ['2019-02-02'], ['2019-02-09'], ['2019-02-16'], ['2019-02-23'], ['2019-03-02'], ['2019-03-09'], ['2019-03-16'], ['2019-03-23'], ['2019-03-30'], ['2019-04-06'], ['2019-04-13'], ['2019-04-20'], ['2019-04-27'], ['2019-05-04'], ['2019-05-18'], ['2019-05-25'], ['2019-06-01'], ['2019-06-08'], ['2019-06-15'], ['2019-06-22'], ['2019-06-29'], ['2019-07-06'], ['2019-07-13'], ['2019-07-20'], ['2019-07-27'], ['2019-08-03'], ['2019-08-10'], ['2019-08-17'], ['2019-08-24'], ['2019-08-31'], ['2019-09-07'], ['2019-09-14'], ['2019-09-21'], ['2019-09-28'], ['2019-10-05'], ['2019-10-12'], ['2019-10-19'], ['2019-10-26'], ['2019-11-02'], ['2019-11-23'], ['2019-12-07'], ['2019-12-21'], ['2019-12-28'], ['2020-01-04'], ['2020-01-11'], ['2020-01-18'], ['2020-01-25'], ['2020-02-08'], ['2020-02-15'], ['2020-02-22'], ['2020-02-29'], ['2020-03-07'], ['2020-03-14'], ['2020-03-21'], ['2020-03-28'], ['2020-04-04'], ['2020-04-11'], ['2020-04-18'], ['2020-04-25'], ['2020-05-02'], ['2020-05-09'], ['2020-05-23'], ['2020-05-30'], ['2020-06-06'], ['2020-06-13'], ['2020-06-20'], ['2020-06-27'], ['2020-07-04'], ['2020-07-11'], ['2020-07-18'], ['2020-07-25']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-nas-jaxa-{time}.tif&resampling_method=bilinear&bidx=1&rescale=0%2C255&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    latlng: latLng([37.7775, -122.416389]),
    id: 19997,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([37.7775, -122.416389]),
        id: 19997,
        aoiID: 'US03',
        country: ['US'],
        city: 'San Francisco - Chlorophyll-a concentration',
        siteName: 'San Francisco',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (NASA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.63569641113281 37.119795894876006, -121.53514084334165 37.119795894876006, -121.53514084334165 38.35512924194336, -122.63569641113281 38.35512924194336, -122.63569641113281 37.119795894876006))').toJson(),
          }],
        },
        time: [['2020-03-02'], ['2020-04-03'], ['2020-04-19'], ['2020-05-04'], ['2020-05-05'], ['2020-05-19'], ['2020-05-21'], ['2020-05-24'], ['2020-06-01'], ['2020-06-03'], ['2020-06-06'], ['2020-06-13'], ['2020-06-18'], ['2020-06-21'], ['2020-06-22'], ['2020-06-23'], ['2020-06-26'], ['2020-06-28'], ['2020-07-01'], ['2020-07-03'], ['2020-07-06'], ['2020-07-08'], ['2020-07-13']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-sf-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Regional Maps',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
        },
      },
    },
  },
  {
    latlng: latLng([41.0114, -73.09]),
    id: 19996,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([41.0114, -73.09]),
        id: 19996,
        aoiID: 'US04',
        country: ['US'],
        city: 'New York - Chlorophyll-a concentration',
        siteName: 'New York',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (NASA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-71.74516 41.54467, -74.43395 41.54943, -74.43219 40.47812, -71.74516 40.48343, -71.74516 41.54467))').toJson(),
          }],
        },
        time: getWeeklyDates('2020-01-01', '2020-07-29'),
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-ny-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    latlng: latLng([35.61, 139.78]),
    id: 19995,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([35.61, 139.78]),
        id: 19995,
        aoiID: 'JP01',
        country: ['JP'],
        city: 'Tokyo - Chlorophyll-a concentration',
        siteName: 'Tokyo',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (JAXA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((139.34275817871094 35.049654646456474, 140.34809152322123 35.049654646456474, 140.34809152322123 35.93543243408203, 139.34275817871094 35.93543243408203, 139.34275817871094 35.049654646456474))').toJson(),
          }],
        },
        time: getWeeklyDates('2018-01-03', '2020-06-10').filter((item) => !['2018-02-07', '2018-02-28', '2018-03-21', '2018-05-23', '2018-06-06', '2018-06-13', '2018-08-15', '2018-08-29', '2018-10-10', '2018-10-31', '2018-12-05', '2019-02-06', '2019-02-20', '2019-04-17', '2019-04-24', '2019-05-01', '2019-06-05', '2019-06-26', '2019-07-03', '2019-07-10', '2019-07-17', '2019-09-18', '2019-10-16', '2019-12-04', '2020-01-22', '2020-02-12', '2020-03-11', '2020-04-22', '2020-05-27', '2020-06-17', '2020-06-24', '2020-07-01', '2020-07-08', '2020-07-15'].includes(item)),
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-tk-{time}.tif&resampling_method=bilinear&bidx=1&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    id: 19993,
    latlng: latLng([43.4, 4.94]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 19993,
        aoi: latLng([43.4, 4.94]),
        aoiID: 'RhoneDelta',
        country: ['FR'],
        city: 'Rhone Delta - Chlorophyll-a concentration',
        siteName: 'Fos-sur-Mer',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (ESA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19585670915520126 43.49375380380885758, 4.19491064380215573 43.49564593451494687, 4.62253218337875094 43.49564593451494687, 4.69632528091630519 43.49753806522103616, 4.69537921556325966 43.48618528098449332, 4.6736197124432115 43.46442577786444161, 4.64523775185184462 43.45401905898093986, 4.67172758173712044 43.42090677162434531, 4.70389380374066945 43.41428431415302924, 4.71146232656503461 43.43698988262612204, 4.75592739815817644 43.43320562121393635, 4.78525542410258886 43.41806857556520782, 4.81647558075309234 43.38495628820861327, 4.83918114922618603 43.38495628820861327, 4.82877443034268428 43.40671579132866498, 4.81552951540004681 43.424691033036531, 4.81836771145918341 43.43604381727307384, 4.86661704446450738 43.41050005274084356, 4.87040130587668951 43.41523037950607034, 4.84012721457923156 43.44928873221571308, 4.85999458699318865 43.4682100392766273, 4.88459228617237251 43.42942135980175777, 4.89499900505587426 43.43793594797917024, 4.91297424676374028 43.43509775192003275, 4.92621916170637775 43.44172020939134882, 4.94608653412033483 43.49280773845580939, 5.21949942115050369 43.49753806522103616, 5.23558253215227776 43.4899695423966719, 5.24693531638882504 43.4672639739235791, 5.23842072821141436 43.43415168656698455, 5.21476909438527514 43.41428431415302924, 5.16557369602690564 43.39157874567993645, 5.08988846778326032 43.39157874567993645, 5.014203239539615 43.39252481103297754, 5.01893356630484355 43.3792798960903454, 5.03690880801270868 43.3565743276172455, 5.07096716072234965 43.34143728196851697, 5.11070190555026294 43.33859908590937948, 5.15327484643731371 43.34427547802765446, 5.21760729044441174 43.34049121661547588, 5.27247908092105533 43.35373613155811512, 5.30275317221851239 43.37265743861902223, 5.33208119816292569 43.36698104650074725, 5.35194857057688189 43.3565743276172455, 5.36140922410733811 43.34143728196851697, 5.36992381228474791 43.32535417096674735, 5.36992381228474791 43.3130553213771492, 5.36613955087256578 43.29791827572842067, 5.36613955087256578 43.28845762219796711, 5.37654626975606753 43.27521270725532787, 5.38600692328652286 43.26102172695964754, 5.38316872722738626 43.25250713878223507, 5.37276200834388451 43.24210041989873332, 5.35478676663601938 43.23263976636827977, 5.35005643987079083 43.22128698213172981, 5.35857102804820151 43.21088026324823517, 5.37749233510911218 43.21655665536650304, 5.39925183822916033 43.21939485142564052, 5.42195740670225401 43.21561059001346194, 5.45412362870580303 43.21939485142564052, 5.50331902706417253 43.20141960971777451, 5.50615722312331002 42.99990768951906972, 4.19301851309606466 42.99896162416602152, 4.19585670915520126 43.49375380380885758))').toJson(),
          }],
        },
        time: getWeeklyDates('2020-01-07', '2020-08-11'),
        inputData: [''],
        display: {
          ...defaultWMSDisplay,
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceIdTrilateral}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM_TRILATERAL',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral.png',
          maxZoom: 13,
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    latlng: latLng([34.7,136.9]),
    id: 19989,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([34.7,136.9]),
        id: 19989,
        aoiID: 'JP04',
        country: ['JP'],
        city: 'Nagoya - Chlorophyll-a concentration',
        siteName: 'Nagoya',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (JAXA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((136.4 34.2, 137.4 34.2, 137.4 35.2, 136.4 35.2, 136.4 34.2))').toJson(),
          }],
        },
        time: getWeeklyDates('2018-01-27', '2020-07-18').filter((item) => !['2018-02-10', '2018-03-03', '2018-05-05', '2018-05-26', '2018-07-14', '2018-07-28', '2018-09-15', '2018-09-22', '2018-10-13', '2018-11-03', '2018-12-08', '2019-06-15', '2019-07-06', '2019-07-13', '2019-07-20', '2019-09-21', '2019-10-19', '2020-01-25', '2020-06-27', '2020-07-04', '2020-07-11'].includes(item)),
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-ng-{time}.tif&resampling_method=bilinear&bidx=1&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    latlng: latLng([34.35,135]),
    id: 19988,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([34.35,135]),
        id: 19988,
        aoiID: 'JP02',
        country: ['JP'],
        city: 'Kobe - Chlorophyll-a concentration',
        siteName: 'Kobe',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (JAXA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((134.5 33.85, 135.5 33.85, 135.5 34.85, 134.5 34.85, 134.5 33.85))').toJson(),
          }],
        },
        time: getWeeklyDates('2018-01-06', '2020-07-18').filter((item) => !['2018-01-20', '2018-02-10', '2018-03-03', '2018-10-13', '2018-12-08', '2018-12-22', '2019-01-26', '2019-06-15', '2019-08-31', '2019-09-21', '2020-01-25', '2020-03-28', '2020-05-16', '2020-06-27', '2020-07-04', '2020-07-11'].includes(item)),
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-kb-{time}.tif&resampling_method=bilinear&bidx=1&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    id: 19992,
    latlng: latLng([45.197522, 13.0297851]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 19992,
        aoi: latLng([45.197522, 13.0297851]),
        aoiID: 'NorthAdriaticESATSM',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic (ESA) - Total Suspended Matter',
        siteName: 'North Adriatic',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (ESA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((13.82676706185932 44.707877452151976,13.826080416351507 44.63853985102104,13.828140352874945 44.60726198073148,13.830543612152288 44.580858170237136,13.824707125335882 44.56324896519081,13.831230257660101 44.53388844187968,13.83226022592182 44.50059527839493,13.14012155404682 44.49471803960046,12.29417428842182 44.482961784844655,12.22825631967182 44.70494937295371,12.28318796029682 44.82439215066662,12.375198458343695 44.80027974205457,12.408844088226507 44.82134821071279,12.466865633636663 44.848433626253936,12.50840768685932 44.941643892166006,12.435623263031195 44.97274112720852,12.430816744476507 45.017413877251585,12.314430330902288 44.96496839839778,12.346874331146429 45.11150096790739,12.3191510187685 45.20785209529116,12.239371393829535 45.20857774137082,12.210467909485052 45.2901538238102,12.22276315560932 45.377400919461266,12.30790719857807 45.48533806813408,12.48368844857807 45.559425118958345,12.622390841156195 45.527685472129804,12.436309908539007 45.47089417163262,12.428413485199163 45.41838351593179,12.782894228607367 45.546202443810486,12.887307261139105 45.60069590187233,12.977987383514593 45.62249048564204,13.101626490265081 45.63083382762503,13.086563204437445 45.72456591874726,13.210159395843695 45.76864898557,13.344055269867132 45.73942388451784,13.406883333831976 45.72384688466227,13.44499215951557 45.67565051875911,13.56034860482807 45.78397406598729,13.65647897592182 45.76194293851278,13.773208712249945 45.66413479361571,13.71965036264057 45.5603866467064,13.48619088998432 45.44295880636075,13.59605417123432 45.16671702535331,13.71690378060932 44.97954140088225,13.778701876312445 44.951120616125884,13.81852731576557 44.86042018307063,13.82402047982807 44.77737580152348,13.82676706185932 44.707877452151976))').toJson(),
          }],
        },
        time: getWeeklyDates('2020-01-07', '2020-08-11'),
        inputData: [''],
        display: {
          ...defaultWMSDisplay,
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceIdTrilateral}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM_TRILATERAL_TSMNN',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral_tsm.png',
          maxZoom: 13,
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 19991,
    latlng: latLng([43.4, 4.9400001]),
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 19991,
        aoi: latLng([43.4, 4.9400001]),
        aoiID: 'RhoneDeltaTSM',
        country: ['FR'],
        city: 'Rhone Delta - Total Suspended Matter',
        siteName: 'Fos-sur-Mer',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (ESA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19585670915520126 43.49375380380885758, 4.19491064380215573 43.49564593451494687, 4.62253218337875094 43.49564593451494687, 4.69632528091630519 43.49753806522103616, 4.69537921556325966 43.48618528098449332, 4.6736197124432115 43.46442577786444161, 4.64523775185184462 43.45401905898093986, 4.67172758173712044 43.42090677162434531, 4.70389380374066945 43.41428431415302924, 4.71146232656503461 43.43698988262612204, 4.75592739815817644 43.43320562121393635, 4.78525542410258886 43.41806857556520782, 4.81647558075309234 43.38495628820861327, 4.83918114922618603 43.38495628820861327, 4.82877443034268428 43.40671579132866498, 4.81552951540004681 43.424691033036531, 4.81836771145918341 43.43604381727307384, 4.86661704446450738 43.41050005274084356, 4.87040130587668951 43.41523037950607034, 4.84012721457923156 43.44928873221571308, 4.85999458699318865 43.4682100392766273, 4.88459228617237251 43.42942135980175777, 4.89499900505587426 43.43793594797917024, 4.91297424676374028 43.43509775192003275, 4.92621916170637775 43.44172020939134882, 4.94608653412033483 43.49280773845580939, 5.21949942115050369 43.49753806522103616, 5.23558253215227776 43.4899695423966719, 5.24693531638882504 43.4672639739235791, 5.23842072821141436 43.43415168656698455, 5.21476909438527514 43.41428431415302924, 5.16557369602690564 43.39157874567993645, 5.08988846778326032 43.39157874567993645, 5.014203239539615 43.39252481103297754, 5.01893356630484355 43.3792798960903454, 5.03690880801270868 43.3565743276172455, 5.07096716072234965 43.34143728196851697, 5.11070190555026294 43.33859908590937948, 5.15327484643731371 43.34427547802765446, 5.21760729044441174 43.34049121661547588, 5.27247908092105533 43.35373613155811512, 5.30275317221851239 43.37265743861902223, 5.33208119816292569 43.36698104650074725, 5.35194857057688189 43.3565743276172455, 5.36140922410733811 43.34143728196851697, 5.36992381228474791 43.32535417096674735, 5.36992381228474791 43.3130553213771492, 5.36613955087256578 43.29791827572842067, 5.36613955087256578 43.28845762219796711, 5.37654626975606753 43.27521270725532787, 5.38600692328652286 43.26102172695964754, 5.38316872722738626 43.25250713878223507, 5.37276200834388451 43.24210041989873332, 5.35478676663601938 43.23263976636827977, 5.35005643987079083 43.22128698213172981, 5.35857102804820151 43.21088026324823517, 5.37749233510911218 43.21655665536650304, 5.39925183822916033 43.21939485142564052, 5.42195740670225401 43.21561059001346194, 5.45412362870580303 43.21939485142564052, 5.50331902706417253 43.20141960971777451, 5.50615722312331002 42.99990768951906972, 4.19301851309606466 42.99896162416602152, 4.19585670915520126 43.49375380380885758))').toJson(),
          }],
        },
        time: getWeeklyDates('2020-01-07', '2020-08-11'),
        inputData: [''],
        display: {
          ...defaultWMSDisplay,
          baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceIdTrilateral}`,
          name: 'Water Quality Index',
          layers: 'N3_CUSTOM_TRILATERAL_TSMNN',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral_tsm.png',
          maxZoom: 13,
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    latlng: latLng([37.7775, -122.4163891]),
    id: 19990,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([37.7775, -122.4163891]),
        id: 19990,
        aoiID: 'US03SPM',
        country: ['US'],
        city: 'San Francisco - Total Suspended Matter',
        siteName: 'San Francisco',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (NASA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.63569641113281 37.119795894876006, -121.53514084334165 37.119795894876006, -121.53514084334165 38.35512924194336, -122.63569641113281 38.35512924194336, -122.63569641113281 37.119795894876006))').toJson(),
          }],
        },
        time: [['2020_03_02'], ['2020_04_03'], ['2020_04_19'], ['2020_05_04'], ['2020_05_05'], ['2020_05_21'], ['2020_05_24'], ['2020_05_28'], ['2020-06-01'], ['2020-06-03'], ['2020-06-06'], ['2020-06-13'], ['2020-06-21'], ['2020-06-22'], ['2020-06-23'], ['2020-06-25'], ['2020-06-28'], ['2020-07-01'], ['2020-07-03']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/spm_anomaly/anomaly-spm-sf-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Regional Maps',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral_tsm.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    latlng: latLng([45.197522, 13.0297851]),
    id: 19987,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([45.197522, 13.0297851]),
        id: 19987,
        aoiID: 'NorthAdriaticJAXATSM',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic (JAXA) - Total Suspended Matter',
        siteName: 'North Adriatic',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (JAXA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((13.82676706185932 44.707877452151976,13.826080416351507 44.63853985102104,13.828140352874945 44.60726198073148,13.830543612152288 44.580858170237136,13.824707125335882 44.56324896519081,13.831230257660101 44.53388844187968,13.83226022592182 44.50059527839493,13.14012155404682 44.49471803960046,12.29417428842182 44.482961784844655,12.22825631967182 44.70494937295371,12.28318796029682 44.82439215066662,12.375198458343695 44.80027974205457,12.408844088226507 44.82134821071279,12.466865633636663 44.848433626253936,12.50840768685932 44.941643892166006,12.435623263031195 44.97274112720852,12.430816744476507 45.017413877251585,12.314430330902288 44.96496839839778,12.346874331146429 45.11150096790739,12.3191510187685 45.20785209529116,12.239371393829535 45.20857774137082,12.210467909485052 45.2901538238102,12.22276315560932 45.377400919461266,12.30790719857807 45.48533806813408,12.48368844857807 45.559425118958345,12.622390841156195 45.527685472129804,12.436309908539007 45.47089417163262,12.428413485199163 45.41838351593179,12.782894228607367 45.546202443810486,12.887307261139105 45.60069590187233,12.977987383514593 45.62249048564204,13.101626490265081 45.63083382762503,13.086563204437445 45.72456591874726,13.210159395843695 45.76864898557,13.344055269867132 45.73942388451784,13.406883333831976 45.72384688466227,13.44499215951557 45.67565051875911,13.56034860482807 45.78397406598729,13.65647897592182 45.76194293851278,13.773208712249945 45.66413479361571,13.71965036264057 45.5603866467064,13.48619088998432 45.44295880636075,13.59605417123432 45.16671702535331,13.71690378060932 44.97954140088225,13.778701876312445 44.951120616125884,13.81852731576557 44.86042018307063,13.82402047982807 44.77737580152348,13.82676706185932 44.707877452151976))').toJson(),
          }],
        },
        time: [['2018-01-20'], ['2018-01-27'], ['2018-03-17'], ['2018-03-24'], ['2018-03-31'], ['2018-04-07'], ['2018-04-14'], ['2018-04-21'], ['2018-04-28'], ['2018-05-05'], ['2018-05-12'], ['2018-05-19'], ['2018-05-26'], ['2018-06-02'], ['2018-06-09'], ['2018-06-16'], ['2018-06-23'], ['2018-06-30'], ['2018-07-07'], ['2018-07-14'], ['2018-07-21'], ['2018-07-28'], ['2018-08-04'], ['2018-08-11'], ['2018-08-18'], ['2018-08-25'], ['2018-09-01'], ['2018-09-08'], ['2018-09-15'], ['2018-09-22'], ['2018-09-29'], ['2018-10-06'], ['2018-10-13'], ['2018-10-20'], ['2018-10-27'], ['2018-11-03'], ['2018-11-17'], ['2018-12-01'], ['2018-12-08'], ['2018-12-15'], ['2018-12-29'], ['2019-01-05'], ['2019-01-12'], ['2019-01-19'], ['2019-01-26'], ['2019-02-02'], ['2019-02-09'], ['2019-02-16'], ['2019-02-23'], ['2019-03-02'], ['2019-03-09'], ['2019-03-16'], ['2019-03-23'], ['2019-03-30'], ['2019-04-06'], ['2019-04-13'], ['2019-04-20'], ['2019-04-27'], ['2019-05-04'], ['2019-05-18'], ['2019-05-25'], ['2019-06-01'], ['2019-06-08'], ['2019-06-15'], ['2019-06-22'], ['2019-06-29'], ['2019-07-06'], ['2019-07-13'], ['2019-07-20'], ['2019-07-27'], ['2019-08-03'], ['2019-08-10'], ['2019-08-17'], ['2019-08-24'], ['2019-08-31'], ['2019-09-07'], ['2019-09-14'], ['2019-09-21'], ['2019-09-28'], ['2019-10-05'], ['2019-10-12'], ['2019-10-19'], ['2019-10-26'], ['2019-11-02'], ['2019-11-23'], ['2019-12-07'], ['2019-12-21'], ['2019-12-28'], ['2020-01-04'], ['2020-01-11'], ['2020-01-18'], ['2020-01-25'], ['2020-02-08'], ['2020-02-15'], ['2020-02-22'], ['2020-02-29'], ['2020-03-07'], ['2020-03-14'], ['2020-03-21'], ['2020-03-28'], ['2020-04-04'], ['2020-04-11'], ['2020-04-18'], ['2020-04-25'], ['2020-05-02'], ['2020-05-09'], ['2020-05-23'], ['2020-05-30'], ['2020-06-06'], ['2020-06-13'], ['2020-06-20'], ['2020-06-27'], ['2020-07-04'], ['2020-07-11'], ['2020-07-18'], ['2020-07-25']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/tsm/nas-{time}.tif&resampling_method=nearest&bidx=1&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral_tsm.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    latlng: latLng([35.61, 139.78]),
    id: 19986,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([35.61, 139.78]),
        id: 19986,
        aoiID: 'JP01TSM',
        country: ['JP'],
        city: 'Tokyo - Total Suspended Matter',
        siteName: 'Tokyo',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (JAXA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((139.34275817871094 35.049654646456474, 140.34809152322123 35.049654646456474, 140.34809152322123 35.93543243408203, 139.34275817871094 35.93543243408203, 139.34275817871094 35.049654646456474))').toJson(),
          }],
        },
        time: getWeeklyDates('2018-01-06', '2020-07-25').filter((item) => !['2018-02-10', '2018-03-03', '2018-03-24', '2018-05-26', '2018-06-09', '2018-06-16', '2018-07-14', '2018-08-18', '2018-09-01', '2018-10-13', '2018-11-03', '2018-12-08', '2019-02-09', '2019-02-23', '2019-04-20', '2019-04-27', '2019-05-04', '2019-06-08', '2019-06-29', '2019-07-06', '2019-07-13', '2019-07-20', '2019-09-21', '2019-10-19', '2019-12-07', '2020-01-25', '2020-02-15', '2020-03-14', '2020-04-25', '2020-05-30', '2020-06-20', '2020-06-27', '2020-07-04', '2020-07-11', '2020-07-18'].includes(item)),
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/tsm/tk-{time}.tif&resampling_method=nearest&bidx=1&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral_tsm.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    latlng: latLng([34.7,136.9]),
    id: 19985,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([34.7,136.9]),
        id: 19985,
        aoiID: 'JP04TSM',
        country: ['JP'],
        city: 'Nagoya - Total Suspended Matter',
        siteName: 'Nagoya',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (JAXA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((136.4 34.2, 137.4 34.2, 137.4 35.2, 136.4 35.2, 136.4 34.2))').toJson(),
          }],
        },
        time: getWeeklyDates('2018-01-27', '2020-07-18').filter((item) => !['2018-02-10', '2018-03-03', '2018-05-05', '2018-05-26', '2018-07-14', '2018-07-28', '2018-09-15', '2018-09-22', '2018-10-13', '2018-11-03', '2018-12-08', '2019-06-01', '2019-06-15', '2019-07-06', '2019-07-13', '2019-07-20', '2019-09-21', '2019-10-19', '2020-01-25', '2020-06-13', '2020-06-27', '2020-07-04', '2020-07-11'].includes(item)),
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/tsm/ng-{time}.tif&resampling_method=nearest&bidx=1&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral_tsm.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    latlng: latLng([34.35,135]),
    id: 19984,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([34.35,135]),
        id: 19984,
        aoiID: 'JP02TSM',
        country: ['JP'],
        city: 'Kobe - Total Suspended Matter',
        siteName: 'Kobe',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (JAXA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((134.5 33.85, 135.5 33.85, 135.5 34.85, 134.5 34.85, 134.5 33.85))').toJson(),
          }],
        },
        time: getWeeklyDates('2018-01-06', '2020-07-18').filter((item) => !['2018-01-20', '2018-02-10', '2018-03-03', '2018-10-13', '2018-12-08', '2018-12-22', '2019-01-26', '2019-06-15', '2019-06-29', '2019-08-31', '2019-09-21', '2020-01-25', '2020-03-28', '2020-05-16', '2020-06-27', '2020-07-04', '2020-07-11'].includes(item)),
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/tsm/kb-{time}.tif&resampling_method=nearest&bidx=1&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral_tsm.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    latlng: latLng([45.197522, 13.0297851]),
    id: 19983,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([45.197522, 13.0297851]),
        id: 19983,
        aoiID: 'NorthAdriaticNASATSM',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic (NASA) - Total Suspended Matter',
        siteName: 'North Adriatic',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (NASA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((13.82676706185932 44.707877452151976,13.826080416351507 44.63853985102104,13.828140352874945 44.60726198073148,13.830543612152288 44.580858170237136,13.824707125335882 44.56324896519081,13.831230257660101 44.53388844187968,13.83226022592182 44.50059527839493,13.14012155404682 44.49471803960046,12.29417428842182 44.482961784844655,12.22825631967182 44.70494937295371,12.28318796029682 44.82439215066662,12.375198458343695 44.80027974205457,12.408844088226507 44.82134821071279,12.466865633636663 44.848433626253936,12.50840768685932 44.941643892166006,12.435623263031195 44.97274112720852,12.430816744476507 45.017413877251585,12.314430330902288 44.96496839839778,12.346874331146429 45.11150096790739,12.3191510187685 45.20785209529116,12.239371393829535 45.20857774137082,12.210467909485052 45.2901538238102,12.22276315560932 45.377400919461266,12.30790719857807 45.48533806813408,12.48368844857807 45.559425118958345,12.622390841156195 45.527685472129804,12.436309908539007 45.47089417163262,12.428413485199163 45.41838351593179,12.782894228607367 45.546202443810486,12.887307261139105 45.60069590187233,12.977987383514593 45.62249048564204,13.101626490265081 45.63083382762503,13.086563204437445 45.72456591874726,13.210159395843695 45.76864898557,13.344055269867132 45.73942388451784,13.406883333831976 45.72384688466227,13.44499215951557 45.67565051875911,13.56034860482807 45.78397406598729,13.65647897592182 45.76194293851278,13.773208712249945 45.66413479361571,13.71965036264057 45.5603866467064,13.48619088998432 45.44295880636075,13.59605417123432 45.16671702535331,13.71690378060932 44.97954140088225,13.778701876312445 44.951120616125884,13.81852731576557 44.86042018307063,13.82402047982807 44.77737580152348,13.82676706185932 44.707877452151976))').toJson(),
          }],
        },
        time: [['2020-01-01'], ['2020-01-08'], ['2020-01-15'], ['2020-01-22'], ['2020-01-29'], ['2020-02-05'], ['2020-02-12'], ['2020-02-19'], ['2020-02-26'], ['2020-03-04'], ['2020-03-11'], ['2020-03-18'], ['2020-03-25'], ['2020-04-01'], ['2020-04-08'], ['2020-04-15'], ['2020-04-22'], ['2020-04-29'], ['2020-05-06'], ['2020-05-13'], ['2020-05-20'], ['2020-05-27'], ['2020-06-03'], ['2020-06-10'], ['2020-06-17'], ['2020-06-24'], ['2020-07-01'], ['2020-07-08'], ['2020-07-15'], ['2020-07-22'], ['2020-07-29']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/spm_anomaly/anomaly-spm-nas-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral_tsm.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    latlng: latLng([41.0114, -73.09]),
    id: 19982,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([41.0114, -73.09]),
        id: 19982,
        aoiID: 'US04TSM',
        country: ['US'],
        city: 'New York - Total Suspended Matter',
        siteName: 'New York',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: 'normal',
        indicatorName: 'Water Quality Regional Maps (NASA)',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-71.74516 41.54467, -74.43395 41.54943, -74.43219 40.47812, -71.74516 40.48343, -71.74516 41.54467))').toJson(),
          }],
        },
        time: getWeeklyDates('2020-01-01', '2020-07-29'),
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/spm_anomaly/anomaly-spm-ny-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: './data/trilateral/WaterQuality_legend_trilateral_tsm.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Cropped Area - Global',
        indicator: 'N6',
        lastIndicatorValue: 'Cropped Area',
        indicatorName: 'Cropped Area',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: 'primary',
        aoi: null,
        aoiID: 'W6',
        time: getMonthlyDates('2020-01-28', '2020-06-28'),
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 6,
          opacity: 0.7,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/agriculture/CropMonitor_{time}.tif&resampling_method=nearest&bidx=1&color_map=custom_cropmonitor',
          name: 'Agriculture GEOGLAM',
          legendUrl: './data/trilateral/agriculture-GEOGLAM-legend.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          features: {
            url: './eodash-data/features/{indicator}_{aoiID}.geojson',
            parameters: ['ADM0_NAME', 'Name'],
            style: {
              color: '#696868',
              opacity: 0.5,
            }
          },
        },
      },
    },
  },
  {
    latlng: latLng([6.133333, 1.216667]),
    id: 19799,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([6.133333, 1.216667]),
        id: 19799,
        aoiID: 'TG01',
        country: ['TG'],
        city: 'Togo',
        siteName: 'Togo',
        description: 'Cropped Area - Regional',
        indicator: 'E10d',
        lastIndicatorValue: 'normal',
        indicatorName: 'Cropped Area - Regional',
        lastColorCode: 'BLUE',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: { type: 'MultiPolygon', coordinates: [[[[0.0, 11.11002], [0.50285, 11.00908], [0.48997, 10.98623], [0.50584, 10.98011], [0.49468, 10.931], [0.65631, 10.99735], [0.91216, 10.99649], [0.89052, 10.92094], [0.90098, 10.88674], [0.88508, 10.86182], [0.87382, 10.80496], [0.80183, 10.71829], [0.79693, 10.68492], [0.80757, 10.59096], [0.78323, 10.51218], [0.77457, 10.38476], [1.05682, 10.17935], [1.3552, 10.0], [1.3693, 9.6615], [1.36606, 9.61139], [1.34159, 9.54626], [1.36109, 9.48638], [1.39021, 9.4973], [1.40114, 9.43463], [1.40312, 9.35491], [1.42092, 9.30743], [1.44741, 9.28273], [1.47767, 9.23691], [1.52597, 9.1907], [1.55912, 9.17015], [1.6176, 9.07092], [1.62974, 8.99912], [1.62241, 8.95456], [1.63311, 8.79376], [1.63112, 8.51869], [1.65019, 8.47767], [1.6302, 8.44951], [1.61974, 8.3741], [1.63347, 8.31899], [1.63145, 7.66111], [1.65051, 7.61399], [1.65293, 7.53402], [1.67753, 7.49791], [1.65334, 7.4945], [1.64388, 7.48555], [1.63642, 7.41777], [1.64203, 6.99457], [1.55783, 6.99749], [1.55918, 6.97219], [1.57411, 6.94711], [1.5779, 6.923], [1.60622, 6.90186], [1.60669, 6.88347], [1.5945, 6.86898], [1.5996, 6.83013], [1.61479, 6.82508], [1.59662, 6.80644], [1.61274, 6.79243], [1.60838, 6.77127], [1.6261, 6.76024], [1.61691, 6.74], [1.59253, 6.7255], [1.59209, 6.70642], [1.57392, 6.68824], [1.58957, 6.68388], [1.60284, 6.66628], [1.61123, 6.64192], [1.60247, 6.62745], [1.6098, 6.60582], [1.61715, 6.59684], [1.6344, 6.59682], [1.65129, 6.57836], [1.67429, 6.5832], [1.66856, 6.55767], [1.68397, 6.56043], [1.69801, 6.54802], [1.70193, 6.51536], [1.69573, 6.50041], [1.71759, 6.49329], [1.72794, 6.49835], [1.73393, 6.47582], [1.75062, 6.46392], [1.74716, 6.45404], [1.75518, 6.43678], [1.77608, 6.41604], [1.76941, 6.41168], [1.77234, 6.3774], [1.78919, 6.35048], [1.78275, 6.33898], [1.79794, 6.31276], [1.78921, 6.30287], [1.80669, 6.28424], [1.79933, 6.28056], [1.7699, 6.28216], [1.76392, 6.27181], [1.64567, 6.24809], [1.62956, 6.24237], [1.627868, 6.23429], [1.378223, 6.176368], [1.294509400000038, 6.148462800000061], [1.280083400000024, 6.140635], [1.285183600000039, 6.135221800000068], [1.199609310000028, 6.112424249000071], [1.200319576000027, 6.168551584000056], [1.085439200000053, 6.168075692000059], [1.083416658000033, 6.187682450000068], [1.065829462000067, 6.219048046000069], [1.024307868000051, 6.254168889000027], [1.008532041000024, 6.291930935000039], [1.005305710000073, 6.33270589600005], [0.893870291000042, 6.333245563000048], [0.88455816000004, 6.354924520000054], [0.856811139000058, 6.383598316000075], [0.828260112000066, 6.400110484000038], [0.788142401000073, 6.408985873000063], [0.78133714300003, 6.432328385000062], [0.748160287000076, 6.44292206700004], [0.744304701000033, 6.481350683000073], [0.725246078000055, 6.490749233000031], [0.712334997000028, 6.528427931000067], [0.744097455000031, 6.558707612000035], [0.740974315000074, 6.582667810000032], [0.727078264000056, 6.591733556000065], [0.710303064000072, 6.586760482000045], [0.68781715700004, 6.592447394000033], [0.684352776000026, 6.597736366000049], [0.690862868000067, 6.598800555000025], [0.672588607000023, 6.614647765000029], [0.656598630000076, 6.608651523000049], [0.638110217000076, 6.63530148600006], [0.648460874000023, 6.710992139000041], [0.642155302000049, 6.72053377800006], [0.65095930800004, 6.737166210000055], [0.621644349000064, 6.754131766000057], [0.60810521600007, 6.747612043000061], [0.580051371000025, 6.763744789000043], [0.566226703000041, 6.78446989400004], [0.56707141000004, 6.803481787000067], [0.576517871000021, 6.799127373000033], [0.58058674900002, 6.807883790000062], [0.548872427000049, 6.83399915800004], [0.539521145000037, 6.825290331000076], [0.532834860000037, 6.828978495000058], [0.532477940000035, 6.856009172000029], [0.54365180700006, 6.864061279000055], [0.534809813000038, 6.877424320000046], [0.558612242000038, 6.887755340000069], [0.565541803000031, 6.918914608000023], [0.547516134000034, 6.937196380000046], [0.522793535000062, 6.941170080000063], [0.521841749000032, 6.971246466000025], [0.548087205000058, 6.991638447000071], [0.57830635800002, 6.99442241600002], [0.595176736000042, 7.00798534300003], [0.60171981600007, 7.036490767000032], [0.595910650000064, 7.061000278000051], [0.613688944000046, 7.101355391000027], [0.592916249000041, 7.115251444000023], [0.606098462000034, 7.159223882000049], [0.617258135000043, 7.162007851000055], [0.616687064000075, 7.183423], [0.629298207000033, 7.196153116000062], [0.645458820000044, 7.29036459200006], [0.658831391000035, 7.318180491000021], [0.644292885000027, 7.398725244000047], [0.618713679000052, 7.412645091000059], [0.59691781600003, 7.398796628000071], [0.566793841000049, 7.395798507000052], [0.538121337000064, 7.424613780000072], [0.532957906000036, 7.458663866000052], [0.521227163000049, 7.456498556000042], [0.519942254000057, 7.462899306000054], [0.528032421000034, 7.48376717900004], [0.520370558000025, 7.515532983000071], [0.530721213000049, 7.588867970000024], [0.521322342000076, 7.594531087000064], [0.588423141000021, 7.62734385400006], [0.594567736000045, 7.703248314000064], [0.611170788000038, 7.710791549000021], [0.632062418000032, 7.706493200000068], [0.620022382000059, 7.746388285000023], [0.611361145000046, 7.751313770000024], [0.632800088000067, 7.777083332000075], [0.62813634500003, 7.796285582000053], [0.617238413000052, 7.801663164000047], [0.624234029000036, 7.864814057000046], [0.609528960000034, 7.944549794000068], [0.596156390000033, 7.976696312000058], [0.598987947000069, 8.024428299000022], [0.583450068000047, 8.095050700000058], [0.59101546200003, 8.138314618000038], [0.605815709000069, 8.144786752000073], [0.611446364000074, 8.183690806000072], [0.601294733000032, 8.181263889000036], [0.590396802000043, 8.191566955000042], [0.587684216000071, 8.207890057000043], [0.618712388000063, 8.216099197000062], [0.637795664000066, 8.258953289000033], [0.672464411000021, 8.264473639000073], [0.684433100000035, 8.282914461000075], [0.726351884000053, 8.284653219000063], [0.731070534000025, 8.34627950600003], [0.710440608000056, 8.357177438000065], [0.710464402000071, 8.385421639000072], [0.698091206000072, 8.395724705000021], [0.705729274000021, 8.401007109000034], [0.692975364000063, 8.40098331400003], [0.685170733000064, 8.417377800000054], [0.650168862000044, 8.427823634000049], [0.654142562000061, 8.460327070000062], [0.642673560000048, 8.479481731000021], [0.643768111000043, 8.494900638000047], [0.627278447000037, 8.498208089000059], [0.627611571000045, 8.508463566000046], [0.617594041000075, 8.513960120000036], [0.568244020000066, 8.525333944000067], [0.558630998000069, 8.550175516000024], [0.538595937000025, 8.555624482000042], [0.52800733600003, 8.569734685000071], [0.510565886000052, 8.563476703000049], [0.490221496000061, 8.597193665000077], [0.471233397000049, 8.595385274000023], [0.375317326000072, 8.753429072000074], [0.401039299000047, 8.757545539000034], [0.381170800000064, 8.770846726000059], [0.383217136000042, 8.791952544000026], [0.41864730900005, 8.792476026000031], [0.427713056000073, 8.78034077500007], [0.442251562000024, 8.789049602000034], [0.431210864000036, 8.797948786000063], [0.450579676000075, 8.812963185000058], [0.466331708000041, 8.792713972000058], [0.48981698800003, 8.800923112000021], [0.49797853900003, 8.814914343000055], [0.495194569000034, 8.839636942000027], [0.519988553000076, 8.856245580000063], [0.524223993000021, 8.880230546000064], [0.509209593000037, 8.902549890000046], [0.511446287000069, 8.936790333000033], [0.49276751900004, 8.95418419300006], [0.466463477000048, 9.006237658000032], [0.454529581000031, 9.050338210000064], [0.463167025000075, 9.05538266800005], [0.465824442000041, 9.091242430000023], [0.483011729000054, 9.101615594000066], [0.474564643000065, 9.14449348100004], [0.490887745000066, 9.155962482000064], [0.501428756000053, 9.153511638000055], [0.530934073000026, 9.20657361700006], [0.504093752000074, 9.257208546000072], [0.537596564000069, 9.303251116000069], [0.554633503000048, 9.307462762000057], [0.544449411000073, 9.343749541000022], [0.564501525000026, 9.403691692000052], [0.551040518000036, 9.422723851000057], [0.524152608000065, 9.43014776900003], [0.51798980500007, 9.439237310000067], [0.498763761000021, 9.436953027000072], [0.493314794000071, 9.449254840000037], [0.504069958000059, 9.46500687200006], [0.500429383000039, 9.473715699000024], [0.48796100800007, 9.486136485000031], [0.456028642000035, 9.497248568000032], [0.413721825000039, 9.499485261000075], [0.386239051000075, 9.490681256000073], [0.359969802000023, 9.498628655000061], [0.345098171000075, 9.485660593000034], [0.350356781000073, 9.473120834000042], [0.337412512000071, 9.450444571000048], [0.285373701000026, 9.428981833000023], [0.26514828400002, 9.428053843000043], [0.249063128000046, 9.436524724000037], [0.230860251000024, 9.464340623000055], [0.23254173700002, 9.485961992000057], [0.270232398000076, 9.477110397000047], [0.314363467000021, 9.505314941000051], [0.294724982000048, 9.522732595000036], [0.245517731000064, 9.522478786000022], [0.238188991000072, 9.541704830000072], [0.242884461000074, 9.571717765000074], [0.267916390000039, 9.563754502000052], [0.290790940000022, 9.573145441000065], [0.358304179000072, 9.569211399000039], [0.384065811000028, 9.586089709000021], [0.374011013000029, 9.606413167000028], [0.382796765000023, 9.640309693000063], [0.369959590000065, 9.650357295000049], [0.362535671000046, 9.672057979000044], [0.351899482000022, 9.674175699000045], [0.345236991000036, 9.715150017000042], [0.32049059700006, 9.724596477000034], [0.327510006000068, 9.770520074000046], [0.336076066000032, 9.776206985000044], [0.331959599000072, 9.793696024000042], [0.357729160000019, 9.845473094000056], [0.354968986000074, 9.91883187600007], [0.386853762000044, 9.936963368000022], [0.359347193000076, 9.98355321400004], [0.359656524000059, 10.028144312000052], [0.409292079000068, 10.020173118000059], [0.417120505000071, 10.056674049000037], [0.394325270000024, 10.08004035600004], [0.361250763000044, 10.085227581000026], [0.353160596000066, 10.101788629000055], [0.363749196000072, 10.133816173000071], [0.351209437000023, 10.167390368000042], [0.362416698000061, 10.260117961000049], [0.382499350000046, 10.272610131000022], [0.369531287000029, 10.284436052000046], [0.397823078000044, 10.306422272000077], [0.389756705000025, 10.31463141200004], [0.321442380000065, 10.307516824000061], [0.338907625000047, 10.325077245000045], [0.33424388100002, 10.335213749000047], [0.319515017000072, 10.335261338000066], [0.314256409000052, 10.361316436000038], [0.294816213000047, 10.373475481000071], [0.302573256000073, 10.391416617000061], [0.288962739000056, 10.417376536000063], [0.275090481000063, 10.418494883000051], [0.255650286000048, 10.405503026000076], [0.219530067000051, 10.423634518000028], [0.207347227000071, 10.415211227000043], [0.210107403000052, 10.403575663000026], [0.193332203000068, 10.401576915000021], [0.185170652000068, 10.419874970000023], [0.173344731000043, 10.425585676000026], [0.175153121000051, 10.446191808000037], [0.15773546600002, 10.462657678000028], [0.16232782700007, 10.472556236000059], [0.143456740000033, 10.525382781000076], [0.061413705000064, 10.560509783000043], [0.056275252000034, 10.582511127000032], [0.040648923000049, 10.600022267000043], [-0.05955698799994, 10.631052376000071], [-0.090680256999974, 10.707266265000044], [-0.072715326999969, 10.719996381000044], [-0.069741000999954, 10.768703947000063], [-0.021937630999957, 10.819838563000076], [-0.028814271999977, 10.859694534000027], [-0.007256355999971, 10.913898655000025], [-0.005876268999941, 10.959608100000025], [0.032385464000072, 10.977406468000027], [0.02275, 11.08191], [0.00987, 11.10144], [-0.00219, 11.10512], [-0.04895, 11.10285], [-0.093750000999933, 11.088630004000038], [-0.143020000999968, 11.10149], [-0.14732, 11.11248], [-0.14201, 11.13898], [0.0, 11.11002]]]] },
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxNativeZoom: 18,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/Togo/togo_cropland_v7-1_cog_v2.tif&resampling_method=bilinear&bidx=1&rescale=0,1&color_map=magma',
          name: 'Togo',
          legendUrl: './data/trilateral/TODO.png',
          attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
          disableCompare: true,
        },
      },
    },
  },
];
