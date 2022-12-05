// config global variables here for now
// temporary solution
import { Wkt } from 'wicket';
import { DateTime } from 'luxon';
import latLng from '@/latLng';
import { shTimeFunction, shS2TimeFunction } from '@/utils';
import { baseLayers, overlayLayers } from '@/config/layers';
import { E13bRemovedFtrs } from '@/config/otherdata';
import availableDates from '@/config/data_dates.json';
import E13dMapTimes from '@/config/data_dates_e13d.json';

import {
  statisticalApiHeaders,
  statisticalApiBody,
  evalScriptsDefinitions,
  parseStatAPIResponse,
  shFisAreaIndicatorStdConfig,
} from '@/helpers/customAreaObjects';

export const dataPath = './eodash-data/internal/';
export const dataEndpoints = [
  {
    type: 'eox',
    provider: './data/internal/pois_eodash.json',
  },
];

export const indicatorsDefinition = Object.freeze({
  C1: {
    indicatorSummary: 'Combined 1',
    indicatorOverwrite: 'Ports and Shipping - impact on air quality',
    themes: ['economy, air'],
  },
  C2: {
    indicatorSummary: 'Combined 2',
    themes: ['economy, air'],
  },
  C3: {
    indicatorSummary: 'Combined 3',
    themes: ['economy, air'],
  },
  E200: {
    indicatorSummary: 'Changes in Ships traffic within the Port',
    themes: ['economy'],
    story: '/eodash-data/stories/E200',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
      allowedParameters: ['TYPE_SUMMARY', 'SPEED (KNOTSx10)', 'classification', 'TIMESTAMP UTC', 'TYPE_NAME', 'LENGTH'],
    },
  },
  E1: {
    indicatorSummary: 'Status of metallic ores (Archived)',
    themes: ['economy'],
    story: '/eodash-data/stories/E1',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
      allowedParameters: ['TYPE_SUMMARY', 'SPEED (KNOTSx10)', 'classification', 'TIMESTAMP UTC', 'TYPE_NAME', 'LENGTH'],
    },
  },
  E1_S2: {
    indicatorSummary: 'Status of metallic ores (Archived)',
    themes: ['economy'],
    story: '/eodash-data/stories/E1',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
  },
  E1a: {
    indicatorSummary: 'Status of non-metallic ores (Archived)',
    themes: ['economy'],
    story: '/eodash-data/stories/E1a',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
      allowedParameters: ['classification'],
    },
  },
  E1a_S2: {
    indicatorSummary: 'Status of non-metallic ores (Archived)',
    themes: ['economy'],
    story: '/eodash-data/stories/E1a',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
  },
  E2: {
    indicatorSummary: 'Volume of oil stockpiled (Archived)',
    themes: ['economy'],
    story: '/eodash-data/stories/E2',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
      allowedParameters: ['classification'],
    },
  },
  E2_S2: {
    indicatorSummary: 'Volume of oil stockpiled (Archived)',
    themes: ['economy'],
    story: '/eodash-data/stories/E2',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
  },
  E2a: {
    indicatorSummary: 'Level of flaring activity',
    themes: ['economy'],
  },
  E3: {
    indicatorSummary: 'Inventory levels of factory inputs',
    themes: ['economy'],
  },
  E4: {
    indicatorSummary: 'Production activity of intermediate goods',
    themes: ['economy'],
    story: '/eodash-data/stories/E4',
  },
  E5: {
    indicatorSummary: 'Inventory levels of intermediate goods',
    themes: ['economy'],
    story: '/eodash-data/stories/E5',
  },
  E6: {
    indicatorSummary: 'Inventory levels of factory inputs',
    themes: ['economy'],
  },
  E7: {
    indicatorSummary: 'Production activity of finished goods',
    themes: ['economy'],
  },
  E8: {
    indicatorSummary: 'Inventory Levels',
    themes: ['economy'],
    story: '/eodash-data/stories/E8',
    maxDecimals: 5,
  },
  E9: {
    indicatorSummary: 'Construction activity',
    themes: ['economy'],
  },
  E10a1: {
    indicatorSummary: 'Harvesting activity',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a1',
  },
  E10a2: {
    indicatorSummary: 'Cum. proportion of total area under active mgmt.',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a2',
    maxDecimals: 4,
  },
  E10a3: {
    indicatorSummary: 'Evolution of the cultivated areas for production of white asparagus',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a2',
  },
  E10a5: {
    indicatorSummary: 'Harvesting activity',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a5',
  },
  E10a6: {
    indicatorSummary: 'Harvested parcels/area evolution over time',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a6',
    maxDecimals: 4,
  },
  E10a8: {
    indicatorSummary: 'Cumulative harvested area',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a8',
  },
  E10a9: {
    indicatorSummary: 'Tomatoes cultivation',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a9',
  },
  E10a10: {
    indicatorSummary: 'Harvesting evolution over time',
    themes: ['agriculture'],
    story: '/eodash-data/stories/E10a10',
  },
  E10b: {
    indicatorSummary: 'Field preparation activity',
    themes: ['agriculture'],
  },
  E11: {
    indicatorSummary: 'Volume of activity at shopping centers',
    themes: ['economy'],
    story: '/eodash-data/stories/E11',
  },
  E11a: {
    indicatorSummary: 'Indicator definition placeholder',
    themes: ['economy'],
  },
  E12a: {
    indicatorSummary: 'Volume of activity logistic interchange centers',
    themes: ['economy'],
  },
  E12b: {
    indicatorSummary: 'Throughput at border crossing points',
    themes: ['economy'],
    story: '/eodash-data/stories/E12b',
    maxDecimals: 3,
  },
  E12c: {
    indicatorSummary: 'Number of Trucks (Beta)',
    themes: ['economy'],
    customAreaFeatures: true,
    customAreaIndicator: true,
    story: '/eodash-data/stories/E12c',
  },
  E12d: {
    indicatorSummary: 'Number of Trucks (Beta)',
    themes: ['economy'],
    customAreaFeatures: true,
    customAreaIndicator: true,
    disableCompare: true,
    story: '/eodash-data/stories/E12c',
  },
  E13a: {
    indicatorSummary: 'Throughput at principal rail stations',
    themes: ['economy'],
  },
  E13c: {
    themes: ['economy'],
    story: '',
  },
  E13b: {
    indicatorSummary: 'Throughput at principal hub airports',
    themes: ['economy'],
    story: '/eodash-data/stories/E13b_PLES',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
    largeTimeDuration: true,
  },
  E13b2: {
    indicatorSummary: 'Throughput at principal hub airports Aerospacelab archived',
    themes: ['economy'],
    story: '/eodash-data/stories/E13b',
  },
  E13d: {
    indicatorSummary: 'Airports: airplanes traffic',
    themes: ['economy'],
    story: '/eodash-data/stories/E13d',
    baseLayers: [baseLayers.terrainLight, {
      ...baseLayers.cloudless,
      visible: true,
    }],
    mapTimeLabelExtended: true,
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmm"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
    largeTimeDuration: true,
  },
  E13e: {
    indicatorSummary: 'Ports and Shipping - traffic (AIS)',
    themes: ['economy'],
    story: '/eodash-data/stories/E13e',
  },
  E13f: {
    indicatorSummary: 'Maritime traffic: fishing',
    themes: ['economy'],
    story: '/eodash-data/stories/E13e',
  },
  E13g: {
    indicatorSummary: 'Maritime traffic: tanker',
    themes: ['economy'],
    story: '/eodash-data/stories/E13e',
  },
  E13h: {
    indicatorSummary: 'Maritime traffic: tug',
    themes: ['economy'],
    story: '/eodash-data/stories/E13e',
  },
  E13i: {
    indicatorSummary: 'Maritime traffic: search, rescue',
    themes: ['economy'],
    story: '/eodash-data/stories/E13e',
  },
  E13l: {
    indicatorSummary: 'Maritime traffic: pleasure craft',
    themes: ['economy'],
    story: '/eodash-data/stories/E13e',
  },
  E13m: {
    indicatorSummary: 'Maritime traffic: passenger',
    themes: ['economy'],
    story: '/eodash-data/stories/E13e',
  },
  E13n: {
    indicatorSummary: 'Ports and Shipping - traffic (AIS, Sentinel-1, mobile)',
    themes: ['economy'],
    story: '/eodash-data/stories/E13n',
  },
  E13o: {
    indicatorSummary: 'Vessel density for all',
    themes: ['economy'],
    story: '/eodash-data/stories/E13o',
  },
  E13p: {
    indicatorSummary: 'Vessel density for cargo',
    themes: ['economy'],
    story: '/eodash-data/stories/E13o',
  },
  E13q: {
    indicatorSummary: 'Vessel density for tankers',
    themes: ['economy'],
    story: '/eodash-data/stories/E13o',
  },
  E13r: {
    indicatorSummary: 'Vessel density for others',
    themes: ['economy'],
    story: '/eodash-data/stories/E13o',
  },
  H1: {
    indicatorSummary: 'Number of temp. treatment sites',
    themes: ['health'],
  },
  N1: {
    indicatorSummary: 'Air quality',
    themes: ['air'],
    story: '/eodash-data/stories/N1',
    externalData: {
      label: 'Sentinel-5p Mapping Service',
      url: 'https://maps.s5p-pal.com',
    },
    largeTimeDuration: true,
  },
  N1a: {
    themes: ['air'],
    story: '/eodash-data/stories/N1_CAMS',
    externalData: {
      label: 'Copernicus Data [ECMWF]',
      url: 'https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis',
    },
  },
  N1b: {
    indicatorSummary: 'CAMS Air quality',
    themes: ['air'],
    story: '/eodash-data/stories/N1_CAMS',
    externalData: {
      label: 'Copernicus Data [ECMWF]',
      url: 'https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis',
    },
  },
  N1c: {
    themes: ['air'],
    story: '/eodash-data/stories/N1_CAMS',
    externalData: {
      label: 'Copernicus Data [ECMWF]',
      url: 'https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis',
    },
  },
  N1d: {
    themes: ['air'],
    story: '/eodash-data/stories/N1_CAMS',
    externalData: {
      label: 'Copernicus Data [ECMWF]',
      url: 'https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis',
    },
  },
  NASAPopulation: {
    indicatorSummary: 'Population',
    themes: ['economy'],
    story: '/data/trilateral/NASAPopulation',
  },
  WSF: {
    indicatorSummary: 'World Settlement Footprint',
    themes: ['economy'],
    story: '/eodash-data/stories/WSF-WSF',
  },
  N2: {
    indicatorSummary: 'CO2 emissions',
    themes: ['air'],
    largeTimeDuration: true,
  },
  N3: {
    indicatorSummary: 'CHL concentration',
    themes: ['water'],
    story: '/eodash-data/stories/N3',
  },
  N3a2: {
    indicatorSummary: 'CHL concentration',
    themes: ['water'],
    story: '/eodash-data/stories/N3a2',
  },
  N4a: {
    indicatorSummary: 'Changes in land fill sites',
    themes: ['land'],
    story: '/eodash-data/stories/N4a',
    disableCSV: true,
  },
  N4b: {
    indicatorSummary: 'Illegal waste levels',
    themes: ['land'],
  },
  N3c: {
    indicatorSummary: 'CMEMS Water Quality',
    themes: ['water'],
    largeTimeDuration: true,
    story: '/eodash-data/stories/N3c',
  },
  N4c: {
    indicatorSummary: 'Changes in land fill sites',
    themes: ['land'],
    story: '/eodash-data/stories/N4c',
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HH"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
    disableCSV: true,
  },
  OX: {
    indicatorSummary: 'Crude Oil Storage Utilization',
    themes: ['economy'],
    story: '/eodash-data/stories/OX',
    disableCSV: true,
  },
  GG: {
    indicatorSummary: 'Mobility',
    themes: ['economy'],
    disableTimeSelection: true,
    story: '/eodash-data/stories/GG-GG',
    disableCSV: true,
  },
  CV: {
    indicatorSummary: 'Covid-19 cases',
    themes: ['health'],
    disableTimeSelection: true,
    story: '/eodash-data/stories/CV-CV',
    disableCSV: true,
  },
  OW: {
    indicatorSummary: 'Covid-19 vaccinations',
    themes: ['health'],
    disableTimeSelection: true,
    story: '/eodash-data/stories/OW-OW',
    disableCSV: true,
  },
  /*
  GSA: {
    indicatorSummary: 'Mobility',
    themes: ['economy'],
    disableTimeSelection: true,
    borderSelection: true,
    story: '/eodash-data/stories/GSA-GSA',
  },
  */
  CDS1: {
    indicatorSummary: 'C3S Data',
    themes: ['air'],
    story: '/eodash-data/stories/CDS',
  },
  CDS2: {
    indicatorSummary: 'Relative humidity',
    themes: ['air'],
    story: '/eodash-data/stories/CDS',
  },
  CDS3: {
    indicatorSummary: 'Wind U field',
    themes: ['air'],
    story: '/eodash-data/stories/CDS',
  },
  CDS4: {
    indicatorSummary: 'Wind V field',
    themes: ['air'],
    story: '/eodash-data/stories/CDS',
  },
  d: { // dummy for locations without Indicator code
    indicatorSummary: 'Upcoming data',
    themes: ['economy'],
  },
});

export const layerNameMapping = Object.freeze({
  // "inputdata" -> wms layer name and baseurl
  '[NEW] Planetscope COVID-19': {
    layers: 'NEW_PLANETSCOPE_COVID-19',
  },
  'PlanetScope - COVID19': {
    layers: 'NEW_PLANETSCOPE_COVID-19',
  },
  'Planetscope COVID-19': {
    layers: 'NEW_PLANETSCOPE_COVID-19',
  },
  '[NEW] Planet COVID-19': {
    layers: 'NEW_PLANETSCOPE_COVID-19',
  },
  '[NEW] Pleiades': {
    layers: 'NEW_PLEIADES',
  },
  '[NEW] Pleiades COVID-19': {
    layers: 'NEW_PLEIADES_COVID19',
  },
  '[NEW] Pleiades COVID19': {
    layers: 'NEW_PLEIADES_COVID19',
  },
  '[NEW] Pleiades - 2.8m - COVID19': {
    layers: 'NEW_PLEIADES_28_COVID19',
  },
  '[NEW] Pleiades 16bit': {
    layers: 'NEW_PLEIADES_16BIT',
  },
  'Sentinel 2 L2A': {
    layers: 'SENTINEL-2-L2A-TRUE-COLOR',
    dateFormatFunction: shS2TimeFunction,
  },
  S2L2A: {
    layers: 'SENTINEL-2-L2A-TRUE-COLOR',
    dateFormatFunction: shS2TimeFunction,
  },
  S1GRD: {
    layers: 'E8_SENTINEL1',
    dateFormatFunction: shS2TimeFunction,
  },
  'S1A - GRD': {
    layers: 'E8_SENTINEL1',
    dateFormatFunction: shS2TimeFunction,
  },
  'Sentinel-2 L1C': {
    layers: 'SENTINEL-2-L2A-TRUE-COLOR',
    dateFormatFunction: shS2TimeFunction,
  },
  'Sentinel-5p Level-3 NO2': {
    layers: 'AWS_NO2-VISUALISATION',
  },
});

export const indicatorClassesIcons = Object.freeze({
  agriculture: 'mdi-barley',
  water: 'mdi-water',
  land: 'mdi-image-filter-hdr',
  health: 'mdi-hospital-box-outline',
  combined: 'mdi-set-center',
  air: 'mdi-weather-windy',
  economy: 'mdi-currency-eur',
});

export const mapDefaults = Object.freeze({
  bounds: [-10, 35, 33, 70],
});

export const baseLayersLeftMap = [{
  ...baseLayers.terrainLight, visible: true,
}, baseLayers.cloudless];
export const baseLayersRightMap = [{
  ...baseLayers.terrainLight, visible: true,
}, baseLayers.cloudless];

export const overlayLayersLeftMap = [{
  ...overlayLayers.eoxOverlay, visible: true,
}];
export const overlayLayersRightMap = [{
  ...overlayLayers.eoxOverlay, visible: true,
}];

export const administrativeLayers = [];

export const defaultLayersDisplay = {
  baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
  protocol: 'WMS',
  dateFormatFunction: shTimeFunction,
  format: 'image/png',
  transparent: true,
  tileSize: 512,
  opacity: 1,
  attribution: '{ <a href="https://race.esa.int/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  minZoom: 7,
  visible: true,
};

export const cmemsDisplay = {
  tileSize: 256,
  minZoom: 1,
  layers: 'CHL',
  dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T00:00:00Z'"),
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

const getYearlyDates = (start, end) => {
  let currentDate = DateTime.fromISO(start);
  const stopDate = DateTime.fromISO(end);
  const dateArray = [];
  while (currentDate <= stopDate) {
    dateArray.push(DateTime.fromISO(currentDate).toFormat('yyyy'));
    currentDate = DateTime.fromISO(currentDate).plus({ years: 1 });
  }
  return dateArray;
};

// AOI_ID key with value = array of additional ISO times to be used in map
// export const additionalMapTimes = {
//   'AT4-E13b': {
//     time: ['2020-11-19T15:37:27'],
//     eoSensor: ['DEIMOS'],
//     inputData: ['Sentinel 2 L2A'],
//     colorCode: ['BLUE'],
//   },
// };
// AOI_ID key with value = array of ISO times to be excluded from map
// overrides set 'Input Data' on the entries
// export const excludeMapTimes = {
//   'AT4-E13b': ['2020-10-04T09:57:22'],
// };

export const additionalMapTimes = {
  ...E13bRemovedFtrs,
};

export const excludeMapTimes = {
};

export const replaceMapTimes = {
  ...E13dMapTimes,
};

const wkt = new Wkt();

export const globalIndicators = [
  /*
  {
    properties: {
      indicatorObject: {
        aoiID: 'GSA',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Truck border crossing times',
        indicatorName: '(select point to load data)',
        indicator: 'GSA',
        lastIndicatorValue: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        inputData: [''],
        yAxis: 'waiting time (min)',
        time: ['TBD'],
        display: {
        },
      },
    },
  },
  */
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'TROPOMI NO2',
        indicator: 'N1',
        lastIndicatorValue: null,
        indicatorName: 'TROPOMI NO2',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'World',
        time: availableDates['AWS_NO2-VISUALISATION'],
        inputData: [''],
        yAxis: 'Tropospheric NO2 (μmol/m2)',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          customAreaIndicator: true,
          name: 'Tropospheric NO2',
          layers: 'AWS_NO2-VISUALISATION',
          minZoom: 1,
          legendUrl: 'legends/esa/AWS_NO2-VISUALISATION.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions['AWS_NO2-VISUALISATION'],
              'byoc-972e67a7-2ca8-4bf6-964a-11fe772e3ac2',
              'P1D',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
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
        description: 'TROPOMI CO',
        indicator: 'N1',
        lastIndicatorValue: null,
        indicatorName: 'TROPOMI CO',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'WorldCO',
        time: availableDates.AWS_VIS_CO_3DAILY_DATA,
        inputData: [''],
        yAxis: 'CO (ppbv)',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          opacity: 1.0,
          customAreaIndicator: true,
          name: 'TROPOMI CO',
          layers: 'AWS_VIS_CO_3DAILY_DATA',
          minZoom: 1,
          legendUrl: 'legends/esa/AWS_VIS_CO_3DAILY_DATA.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_CO_3DAILY_DATA,
              'byoc-57a07405-8ec2-4b9c-a273-23e287c173f8',
              'P3D',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
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
        description: 'TROPOMI CH4',
        indicator: 'N1',
        lastIndicatorValue: null,
        indicatorName: 'TROPOMI CH4',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'CH4',
        time: availableDates.AWS_CH4_WEEKLY,
        inputData: [''],
        yAxis: 'CH4 volume mixing ratio (ppbv)',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          opacity: 1.0,
          customAreaIndicator: true,
          name: 'TROPOMI CH4',
          layers: 'AWS_CH4_WEEKLY',
          minZoom: 1,
          legendUrl: 'legends/esa/AWS_CH4_WEEKLY.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_CH4_WEEKLY_DATA,
              'byoc-0ecb4a55-5ce2-4525-bdcb-a333d37d46ef',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
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
        description: 'Vessel density',
        indicator: 'E13o',
        lastIndicatorValue: null,
        indicatorName: 'Vessel density',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'World',
        time: getMonthlyDates('2017-01-01', '2020-12-01'),
        inputData: [''],
        yAxis: 'Vessel density',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Vessel density',
          layers: 'AWS_VIS_VESSELDENSITY_ALL',
          minZoom: 1,
          legendUrl: 'legends/esa/AWS_VIS_VESSELDENSITY_ALL.png',
          dateFormatFunction: (date) => date,
          customAreaIndicator: true,
          areaIndicator: {
            ...shFisAreaIndicatorStdConfig,
            url: `https://services.sentinel-hub.com/ogc/fis/${shConfig.shInstanceId}?LAYER=AWS_RAW_VESSELDENSITY_ALL&CRS=CRS:84&TIME=2000-01-01/2050-01-01&RESOLUTION=2500m&GEOMETRY={area}`,
          },
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
        description: 'Vessel density for cargo',
        indicator: 'E13p',
        lastIndicatorValue: null,
        indicatorName: 'Vessel density for cargo',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'World',
        time: getMonthlyDates('2017-01-01', '2020-12-01'),
        inputData: [''],
        yAxis: 'Vessel density for cargo',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          customAreaIndicator: true,
          name: 'Vessel density for cargo',
          layers: 'AWS_VIS_VESSELDENSITY_CARGO',
          minZoom: 1,
          legendUrl: 'legends/esa/AWS_VIS_VESSELDENSITY_ALL.png',
          dateFormatFunction: (date) => date,
          areaIndicator: {
            ...shFisAreaIndicatorStdConfig,
            url: `https://services.sentinel-hub.com/ogc/fis/${shConfig.shInstanceId}?LAYER=AWS_RAW_VESSELDENSITY_CARGO&CRS=CRS:84&TIME=2000-01-01/2050-01-01&RESOLUTION=2500m&GEOMETRY={area}`,
          },
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
        description: 'Vessel density for tankers',
        indicator: 'E13q',
        lastIndicatorValue: null,
        indicatorName: 'Vessel density for tankers',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'World',
        time: getMonthlyDates('2017-01-01', '2020-12-01'),
        inputData: [''],
        yAxis: 'Vessel density for tankers',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          customAreaIndicator: true,
          name: 'Vessel density for tankers',
          layers: 'AWS_VIS_VESSELDENSITY_TANKER',
          minZoom: 1,
          legendUrl: 'legends/esa/AWS_VIS_VESSELDENSITY_ALL.png',
          dateFormatFunction: (date) => date,
          areaIndicator: {
            ...shFisAreaIndicatorStdConfig,
            url: `https://services.sentinel-hub.com/ogc/fis/${shConfig.shInstanceId}?LAYER=AWS_RAW_VESSELDENSITY_TANKER&CRS=CRS:84&TIME=2000-01-01/2050-01-01&RESOLUTION=2500m&GEOMETRY={area}`,
          },
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
        description: 'Vessel density for others',
        indicator: 'E13r',
        lastIndicatorValue: null,
        indicatorName: 'Vessel density for others',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'World',
        time: getMonthlyDates('2017-01-01', '2020-12-01'),
        inputData: [''],
        yAxis: 'Vessel density for others',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          customAreaIndicator: true,
          name: 'Vessel density for others',
          layers: 'AWS_VIS_VESSELDENSITY_OTHER',
          minZoom: 1,
          legendUrl: 'legends/esa/AWS_VIS_VESSELDENSITY_ALL.png',
          dateFormatFunction: (date) => date,
          areaIndicator: {
            ...shFisAreaIndicatorStdConfig,
            url: `https://services.sentinel-hub.com/ogc/fis/${shConfig.shInstanceId}?LAYER=AWS_RAW_VESSELDENSITY_OTHER&CRS=CRS:84&TIME=2000-01-01/2050-01-01&RESOLUTION=2500m&GEOMETRY={area}`,
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'GCAQ1',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'CAMS Air Quality',
        indicator: 'N1b',
        lastIndicatorValue: null,
        indicatorName: 'CAMS daily averaged NO2',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: getDailyDates(DateTime.utc().minus({ years: 1, days: -1 }).toFormat('yyyy-LL-dd'), DateTime.utc().minus({ days: 2 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        yAxis: 'NO2 (μmol/m2)',
        display: {
          styles: 'sh_OrangesTransparent40_surface_concentration',
          baseUrl: 'https://apps.ecmwf.int/wms/?token=public',
          name: 'CAMS daily averaged NO2',
          layers: 'composition_europe_no2_analysis_surface',
          legendUrl: 'legends/esa/GCAQ1-N1b.png',
          maxZoom: 13,
          minZoom: 1,
          attribution: '{ <a href="https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis" target="_blank">CAMS source data information</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'GCAQ2',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'CAMS Air Quality',
        indicator: 'N1b',
        lastIndicatorValue: null,
        indicatorName: 'CAMS daily averaged PM2.5',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: getDailyDates(DateTime.utc().minus({ years: 1, days: -1 }).toFormat('yyyy-LL-dd'), DateTime.utc().minus({ days: 2 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        yAxis: 'PM2.5 (μg/m3)',
        display: {
          styles: 'sh_PurplesTransparent40_surface_concentration',
          baseUrl: 'https://apps.ecmwf.int/wms/?token=public',
          name: 'CAMS daily averaged PM2.5',
          layers: 'composition_europe_pm2p5_analysis_surface',
          legendUrl: 'legends/esa/GCAQ2-N1b.png',
          maxZoom: 13,
          minZoom: 1,
          attribution: '{ <a href="https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis" target="_blank">CAMS source data information</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'GCAQ3',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'CAMS Air Quality',
        indicator: 'N1b',
        lastIndicatorValue: null,
        indicatorName: 'CAMS daily averaged PM10',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: getDailyDates(DateTime.utc().minus({ years: 1, days: -1 }).toFormat('yyyy-LL-dd'), DateTime.utc().minus({ days: 2 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        yAxis: 'PM10 (μg/m3)',
        display: {
          styles: 'sh_GreensTransparent40_surface_concentration',
          baseUrl: 'https://apps.ecmwf.int/wms/?token=public',
          name: 'CAMS daily averaged PM2.5',
          layers: 'composition_europe_pm10_analysis_surface',
          legendUrl: 'legends/esa/GCAQ3-N1b.png',
          maxZoom: 13,
          minZoom: 1,
          attribution: '{ <a href="https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis" target="_blank">CAMS source data information</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'GCAQ4',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'CAMS Air Quality',
        indicator: 'N1b',
        lastIndicatorValue: null,
        indicatorName: 'CAMS daily averaged O3',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: getDailyDates(DateTime.utc().minus({ years: 1, days: -1 }).toFormat('yyyy-LL-dd'), DateTime.utc().minus({ days: 2 }).toFormat('yyyy-LL-dd')),
        inputData: [''],
        yAxis: 'O3 (μg/m3)',
        display: {
          styles: 'sh_OrangesTransparent240_surface_concentration',
          baseUrl: 'https://apps.ecmwf.int/wms/?token=public',
          name: 'CAMS daily averaged PM2.5',
          layers: 'composition_europe_o3_analysis_surface',
          legendUrl: 'legends/esa/GCAQ4-N1b.png',
          maxZoom: 13,
          minZoom: 1,
          attribution: '{ <a href="https://atmosphere.copernicus.eu/european-air-quality-information-support-covid-19-crisis" target="_blank">CAMS source data information</a> }',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
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
        lastIndicatorValue: null,
        indicatorName: 'Population density 2020',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'W6',
        time: [],
        inputData: [''],
        display: {
          disableTimeSelection: true,
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Population',
          layers: 'AWS_POPULATION_DENSITY',
          legendUrl: 'legends/esa/AWS_POPULATION_DENSITY.png',
          minZoom: 1,
          maxZoom: 7,
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
        description: 'WSF Evolution',
        indicator: 'WSF',
        lastIndicatorValue: null,
        indicatorName: 'World Settlement Footprint (WSF) Evolution',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'WSF',
        time: getYearlyDates('1985', '2015'),
        inputData: [''],
        display: {
          baseUrl: 'https://a.geoservice.dlr.de/eoc/land/wms/',
          name: 'WSF_Evolution',
          layers: 'WSF_Evolution',
          legendUrl: 'eodash-data/data/wsf_legend.png', // will not be migrated as too hard to replicates
          minZoom: 1,
          maxZoom: 14,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy'),
          labelFormatFunction: (date) => date,
          specialEnvTime: true,
          attribution: '{ WSF Evolution Data are licensed under: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"> Attribution 4.0 International (CC BY 4.0) </a>; Contains modified Landsat-5/-7 data [1985-2015] }',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'CDS',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'C3S Data',
        indicator: 'CDS1',
        lastIndicatorValue: null,
        indicatorName: 'Temperature - Climate Data Store',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: availableDates.AWS_VIS_2MTEMPERATURE,
        inputData: [],
        yAxis: 'Temperature K',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Global temperature',
          layers: 'AWS_VIS_2MTEMPERATURE',
          legendUrl: 'legends/esa/AWS_VIS_2MTEMPERATURE.png',
          minZoom: 1,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...shFisAreaIndicatorStdConfig,
            url: `https://services.sentinel-hub.com/ogc/fis/${shConfig.shInstanceId}?LAYER=AWS_RAW_2MTEMPERATURE&CRS=CRS:84&TIME=2000-01-01/2050-01-01&RESOLUTION=2500m&GEOMETRY={area}`,
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'CDS',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Relative humidity 1000HPA (C3S)',
        indicator: 'CDS2',
        lastIndicatorValue: null,
        indicatorName: 'Relative humidity 1000HPA - Climate Data Store',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: availableDates.AWS_VIS_RELHUMIDITY1000HPA,
        inputData: [],
        yAxis: 'Relative Humidity 1000HPA',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Global temperature',
          layers: 'AWS_VIS_RELHUMIDITY1000HPA',
          legendUrl: 'legends/esa/AWS_VIS_RELHUMIDITY1000HPA.png',
          minZoom: 1,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...shFisAreaIndicatorStdConfig,
            url: `https://services.sentinel-hub.com/ogc/fis/${shConfig.shInstanceId}?LAYER=AWS_RAW_RELHUMIDITY1000HPA&CRS=CRS:84&TIME=2000-01-01/2050-01-01&RESOLUTION=2500m&GEOMETRY={area}`,
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'CDS',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Wind U field (C3S)',
        indicator: 'CDS3',
        lastIndicatorValue: null,
        indicatorName: 'Wind U field - Climate Data Store',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: availableDates.AWS_VIS_WIND_U_10M,
        inputData: [],
        yAxis: 'wind',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Global temperature',
          layers: 'AWS_VIS_WIND_U_10M',
          legendUrl: 'legends/esa/AWS_VIS_WIND_U_10M.png',
          minZoom: 1,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...shFisAreaIndicatorStdConfig,
            url: `https://services.sentinel-hub.com/ogc/fis/${shConfig.shInstanceId}?LAYER=AWS_RAW_WIND_U_10M&CRS=CRS:84&TIME=2000-01-01/2050-01-01&RESOLUTION=2500m&GEOMETRY={area}`,
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'CDS',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Wind V field (C3S)',
        indicator: 'CDS4',
        lastIndicatorValue: null,
        indicatorName: 'Wind V field - Climate Data Store',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: availableDates.AWS_VIS_WIND_V_10M,
        inputData: [],
        yAxis: 'wind',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Global temperature',
          layers: 'AWS_VIS_WIND_V_10M',
          legendUrl: 'legends/esa/AWS_VIS_WIND_U_10M.png',
          minZoom: 1,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...shFisAreaIndicatorStdConfig,
            url: `https://services.sentinel-hub.com/ogc/fis/${shConfig.shInstanceId}?LAYER=AWS_RAW_WIND_V_10M&CRS=CRS:84&TIME=2000-01-01/2050-01-01&RESOLUTION=2500m&GEOMETRY={area}`,
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'SO2',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'TROPOMI SO2',
        indicator: 'N1',
        lastIndicatorValue: null,
        indicatorName: 'TROPOMI SO2',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        time: availableDates.AWS_VIS_SO2_DAILY_DATA,
        inputData: [],
        yAxis: 'SO2',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'SO2',
          layers: 'AWS_VIS_SO2_DAILY_DATA',
          legendUrl: 'legends/esa/AWS_VIS_SO2_DAILY_DATA.png',
          minZoom: 1,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_SO2_DAILY_DATA,
              'byoc-4ad9663f-d173-411d-8d28-3081d4d9e3aa',
            ),
            callbackFunction: parseStatAPIResponse,
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    id: 9999,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9999,
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriatic',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic - Chlorophyll-a concentration',
        siteName: 'North Adriatic',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: null,
        indicatorName: 'Water Quality Regional Maps',
        lastColorCode: null,
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.17439 44.77803,12.19636 44.81699,12.08514 45.40526,12.42602 45.58351,13.15366 45.77914,13.60398 45.81168,13.80442 45.67566,13.82364 45.59696,13.62603 45.44300,13.54915 45.43337,13.62603 45.32346,13.71390 45.09523,13.78383 44.98060,13.83051 44.89215,13.83938 44.49919,12.23482 44.48155,12.06659 44.58146,12.17439 44.77803))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM,
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM',
          legendUrl: 'legends/esa/AWS_N3_CUSTOM.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 9998,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9999,
        aoi: latLng([43.4, 4.94]),
        aoiID: 'RhoneDelta',
        country: ['FR'],
        city: 'Rhone Delta - Chlorophyll-a concentration',
        siteName: 'Fos-sur-Mer',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: null,
        indicatorName: 'Water Quality Regional Maps',
        lastColorCode: null,
        sensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19585 43.49375, 4.19491 43.49564, 4.62253 43.49564, 4.69632 43.49753, 4.69537 43.48618, 4.67361 43.46442, 4.64523 43.45401, 4.67172 43.42090, 4.70389 43.41428, 4.71146 43.43698, 4.75592 43.43320, 4.78525 43.41806, 4.81647 43.38495, 4.83918 43.38495, 4.82877 43.40671, 4.81552 43.42469, 4.81836 43.43604, 4.86661 43.41050, 4.87040 43.41523, 4.84012 43.44928, 4.85999 43.46821, 4.88459 43.42942, 4.89499 43.43793, 4.91297 43.43509, 4.92621 43.44172, 4.94608 43.49280, 5.21949 43.49753, 5.23558 43.48996, 5.24693 43.46726, 5.23842 43.43415, 5.21476 43.41428, 5.16557 43.39157, 5.08988 43.39157, 5.01420 43.39252, 5.01893 43.37927, 5.03690 43.35657, 5.07096 43.34143, 5.11070 43.33859, 5.15327 43.34427, 5.21760 43.34049, 5.27247 43.35373, 5.30275 43.37265, 5.33208 43.36698, 5.35194 43.35657, 5.36140 43.34143, 5.36992 43.32535, 5.36992 43.31305, 5.36613 43.29791, 5.36613 43.28845, 5.37654 43.27521, 5.38600 43.26102, 5.38316 43.25250, 5.37276 43.24210, 5.35478 43.23263, 5.35005 43.22128, 5.35857 43.21088, 5.37749 43.21655, 5.39925 43.21939, 5.42195 43.21561, 5.45412 43.21939, 5.50331 43.20141, 5.50615 42.99990, 4.19301 42.99896, 4.19585 43.49375))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM,
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM',
          legendUrl: 'legends/esa/AWS_N3_CUSTOM.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 9997,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9997,
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriaticTSM',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic - Total Suspended Matter',
        siteName: 'North Adriatic',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: null,
        indicatorName: 'Water Quality Regional Maps',
        lastColorCode: null,
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.17439 44.77803,12.19636 44.81699,12.08514 45.40526,12.42602 45.58351,13.15366 45.77914,13.60398 45.81168,13.80442 45.67566,13.82364 45.59696,13.62603 45.44300,13.54915 45.43337,13.62603 45.32346,13.71390 45.09523,13.78383 44.98060,13.83051 44.89215,13.83938 44.49919,12.23482 44.48155,12.06659 44.58146,12.17439 44.77803))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM_TSMNN,
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TSMNN',
          legendUrl: 'legends/esa/AWS_N3_CUSTOM_TSMNN.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 9996,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9996,
        aoi: latLng([43.4, 4.94]),
        aoiID: 'RhoneDeltaTSM',
        country: ['FR'],
        city: 'Rhone Delta - Total Suspended Matter',
        siteName: 'Fos-sur-Mer',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: null,
        indicatorName: 'Water Quality Regional Maps',
        lastColorCode: null,
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19585 43.49375, 4.19491 43.49564, 4.62253 43.49564, 4.69632 43.49753, 4.69537 43.48618, 4.67361 43.46442, 4.64523 43.45401, 4.67172 43.42090, 4.70389 43.41428, 4.71146 43.43698, 4.75592 43.43320, 4.78525 43.41806, 4.81647 43.38495, 4.83918 43.38495, 4.82877 43.40671, 4.81552 43.42469, 4.81836 43.43604, 4.86661 43.41050, 4.87040 43.41523, 4.84012 43.44928, 4.85999 43.46821, 4.88459 43.42942, 4.89499 43.43793, 4.91297 43.43509, 4.92621 43.44172, 4.94608 43.49280, 5.21949 43.49753, 5.23558 43.48996, 5.24693 43.46726, 5.23842 43.43415, 5.21476 43.41428, 5.16557 43.39157, 5.08988 43.39157, 5.01420 43.39252, 5.01893 43.37927, 5.03690 43.35657, 5.07096 43.34143, 5.11070 43.33859, 5.15327 43.34427, 5.21760 43.34049, 5.27247 43.35373, 5.30275 43.37265, 5.33208 43.36698, 5.35194 43.35657, 5.36140 43.34143, 5.36992 43.32535, 5.36992 43.31305, 5.36613 43.29791, 5.36613 43.28845, 5.37654 43.27521, 5.38600 43.26102, 5.38316 43.25250, 5.37276 43.24210, 5.35478 43.23263, 5.35005 43.22128, 5.35857 43.21088, 5.37749 43.21655, 5.39925 43.21939, 5.42195 43.21561, 5.45412 43.21939, 5.50331 43.20141, 5.50615 42.99990, 4.19301 42.99896, 4.19585 43.49375))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM_TSMNN,
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TSMNN',
          legendUrl: 'legends/esa/AWS_N3_CUSTOM_TSMNN.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Europe',
        siteName: 'global',
        description: 'Number of Trucks (Beta)',
        indicator: 'E12c',
        lastIndicatorValue: 'Regional Truck Traffic Motorways',
        indicatorName: 'Motorways',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-15 35, -15 70, 40 70, 40 35, -15 35))').toJson(),
          }],
        },
        lastColorCode: 'primary',
        eoSensor: ['2017-06-30', '2018-06-30', '2019-06-30', '2020-06-30'],
        aoi: null,
        aoiID: 'W2',
        time: availableDates.AWS_E12C_NEW_MOTORWAY,
        inputData: [''],
        yAxis: 'Number of trucks detected',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Aggregated Truck Traffic 10km',
          layers: 'AWS_E12C_NEW_MOTORWAY',
          legendUrl: 'legends/esa/AWS_E12C_NEW_MOTORWAY.png',
          minZoom: 1,
          maxZoom: 10,
          dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-01-01')}/${DateTime.fromISO(date).toFormat('yyyy-12-31')}`,
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((5 45,5 50,15 50,15 45,5 45))').toJson(),
            }],
          },
          features: {
            url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/rpc/geodb_get_pg`,
            requestMethod: 'POST',
            requestHeaders: {
              'Content-Type': 'application/json',
            },
            requestBody: {
              collection: 'geodb_49a05d04-5d72-4c0f-9065-6e6827fd1871_trucks',
              select: 'sum_observations, ST_AsGeoJSON(geometry, 6) as "geometry", truck_count_normalized',
              where: 'osm_value=1 AND date_part(\'year\',time)={featuresTime} AND ST_Intersects(ST_GeomFromText(\'{area}\',4326), geometry)',
              limit: '1000',
            },
            dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy')}`,
            callbackFunction: (responseJson) => { // geom from wkb to geojson features
              const ftrs = [];
              if (Array.isArray(responseJson[0].src)) {
                responseJson[0].src.forEach((ftr) => {
                  const { geometry, ...properties } = ftr;
                  ftrs.push({
                    type: 'Feature',
                    properties,
                    geometry: JSON.parse(geometry),
                  });
                });
              }
              const ftrColl = {
                type: 'FeatureCollection',
                features: ftrs,
              };
              return ftrColl;
            },
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
          areaIndicator: {
            url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/rpc/geodb_get_pg`,
            requestMethod: 'POST',
            requestHeaders: {
              'Content-Type': 'application/json',
            },
            requestBody: {
              collection: 'geodb_49a05d04-5d72-4c0f-9065-6e6827fd1871_trucks',
              select: 'sum(truck_count_normalized), time',
              group: 'time',
              where: 'osm_value=1 AND ST_Intersects(ST_GeomFromText(\'{area}\',4326), geometry)',
            },
            callbackFunction: (responseJson, indicator) => {
              if (Array.isArray(responseJson[0].src)) {
                const data = responseJson[0].src;
                const newData = {
                  time: [],
                  measurement: [],
                  colorCode: [],
                  referenceValue: [],
                };
                data.sort((a, b) => ((DateTime.fromISO(a.time) > DateTime.fromISO(b.time))
                  ? 1
                  : -1));
                data.forEach((row) => {
                  let updateDate = row.time;
                  // temporary workaround until DB gets updated 2020-01-01 - 2020-04-01
                  if (row.time === '2020-01-01T00:00:00') {
                    updateDate = '2020-04-01T00:00:00';
                  }
                  newData.time.push(DateTime.fromISO(updateDate)); // actual data
                  newData.measurement.push(Math.round(row.sum * 10) / 10); // actual data
                  newData.colorCode.push('BLUE'); // made up data
                  newData.referenceValue.push('0'); // made up data
                });
                const ind = {
                  ...indicator,
                  ...newData,
                };
                return ind;
              }
              return null;
            },
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Europe',
        siteName: 'global',
        description: 'Number of Trucks (Beta)',
        indicator: 'E12d',
        lastIndicatorValue: 'Regional Truck Traffic Primary',
        indicatorName: 'Primary Roads',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-15 35, -15 70, 40 70, 40 35, -15 35))').toJson(),
          }],
        },
        lastColorCode: 'primary',
        eoSensor: ['2017-06-30', '2018-06-30', '2019-06-30', '2020-06-30'],
        aoi: null,
        aoiID: 'W3',
        time: availableDates.AWS_E12D_NEW_PRIMARYROADS,
        inputData: [''],
        yAxis: 'Number of trucks detected',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Aggregated Truck Traffic 10km',
          layers: 'AWS_E12D_NEW_PRIMARYROADS',
          legendUrl: 'legends/esa/AWS_E12C_NEW_MOTORWAY.png',
          minZoom: 1,
          maxZoom: 10,
          dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy-01-01')}/${DateTime.fromISO(date).toFormat('yyyy-12-31')}`,
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((5 45,5 50,15 50,15 45,5 45))').toJson(),
            }],
          },
          features: {
            url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/rpc/geodb_get_pg`,
            requestMethod: 'POST',
            requestHeaders: {
              'Content-Type': 'application/json',
            },
            requestBody: {
              collection: 'geodb_49a05d04-5d72-4c0f-9065-6e6827fd1871_trucks',
              select: 'sum_observations, ST_AsGeoJSON(geometry, 6) as "geometry", truck_count_normalized',
              where: 'osm_value=3 AND date_part(\'year\',time)={featuresTime} AND ST_Intersects(ST_GeomFromText(\'{area}\',4326), geometry)',
              limit: '1000',
            },
            dateFormatFunction: (date) => `${DateTime.fromISO(date).toFormat('yyyy')}`,
            callbackFunction: (responseJson) => { // geom from wkb to geojson features
              const ftrs = [];
              if (Array.isArray(responseJson[0].src)) {
                responseJson[0].src.forEach((ftr) => {
                  const { geometry, ...properties } = ftr;
                  ftrs.push({
                    type: 'Feature',
                    properties,
                    geometry: JSON.parse(geometry),
                  });
                });
              }
              const ftrColl = {
                type: 'FeatureCollection',
                features: ftrs,
              };
              return ftrColl;
            },
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
          areaIndicator: {
            url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/rpc/geodb_get_pg`,
            requestMethod: 'POST',
            requestHeaders: {
              'Content-Type': 'application/json',
            },
            requestBody: {
              collection: 'geodb_49a05d04-5d72-4c0f-9065-6e6827fd1871_trucks',
              select: 'sum(truck_count_normalized), time',
              group: 'time',
              where: 'osm_value=3 AND ST_Intersects(ST_GeomFromText(\'{area}\',4326), geometry)',
            },
            callbackFunction: (responseJson, indicator) => {
              if (Array.isArray(responseJson[0].src)) {
                const data = responseJson[0].src;
                const newData = {
                  time: [],
                  measurement: [],
                  colorCode: [],
                  referenceValue: [],
                };
                data.sort((a, b) => ((DateTime.fromISO(a.time) > DateTime.fromISO(b.time))
                  ? 1
                  : -1));
                data.forEach((row) => {
                  let updateDate = row.time;
                  // temporary workaround until DB gets updated 2020-01-01 - 2020-04-01
                  if (row.time === '2020-01-01T00:00:00') {
                    updateDate = '2020-04-01T00:00:00';
                  }
                  newData.time.push(DateTime.fromISO(updateDate)); // actual data
                  newData.measurement.push(Math.round(row.sum * 10) / 10); // actual data
                  newData.colorCode.push('BLUE'); // made up data
                  newData.referenceValue.push('0'); // made up data
                });
                const ind = {
                  ...indicator,
                  ...newData,
                };
                return ind;
              }
              return null;
            },
            areaFormatFunction: (area) => ({ area: wkt.read(JSON.stringify(area)).write() }),
          },
        },
      },
    },
  },
  {
    id: 9995,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9995,
        aoi: latLng([40.985, 1.769]),
        aoiID: 'Barcelona',
        country: ['ES'],
        city: 'Barcelona - Chlorophyll-a concentration',
        siteName: 'Barcelona',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: null,
        indicatorName: 'Water Quality Regional Maps',
        lastColorCode: null,
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((2.51654 40.48551,2.52203 41.56245,2.29138 41.48024,2.21137 41.41621,2.16469 41.3132,2.04936 41.27401,1.91756 41.26782,1.69241 41.21208,1.44803 41.17489,1.26680 41.12942,1.16796 41.07770,0.95079 41.02793,0.72612 40.81047,0.84918 40.72269,0.85468 40.68523,0.65970 40.6644,0.54987 40.57688,0.48396 40.48501,2.51654 40.48551))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM,
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM',
          legendUrl: 'legends/esa/AWS_N3_CUSTOM.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    id: 9994,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9994,
        aoi: latLng([40.985, 1.769]),
        aoiID: 'BarcelonaTSM',
        country: ['ES'],
        city: 'Barcelona - Total Suspended Matter',
        siteName: 'Barcelona',
        description: 'Water Quality Regional Maps',
        indicator: 'N3a2',
        lastIndicatorValue: null,
        indicatorName: 'Water Quality Regional Maps',
        lastColorCode: null,
        sensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((2.51654 40.48551,2.52203 41.56245,2.29138 41.48024,2.21137 41.41621,2.16469 41.3132,2.04936 41.27401,1.91756 41.26782,1.69241 41.21208,1.44803 41.17489,1.26680 41.12942,1.16796 41.07770,0.95079 41.02793,0.72612 40.81047,0.84918 40.72269,0.85468 40.68523,0.65970 40.6644,0.54987 40.57688,0.48396 40.48501,2.51654 40.48551))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM_TSMNN,
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TSMNN',
          legendUrl: 'legends/esa/AWS_N3_CUSTOM_TSMNN.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Europe',
        siteName: 'global',
        description: 'CMEMS Water Quality',
        indicator: 'N3c',
        lastIndicatorValue: null,
        indicatorName: 'CMEMS Water Quality',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'World',
        time: availableDates.CHL,
        inputData: [''],
        externalData: {
          label: 'Copernicus Marine Service - Product Details',
          url: 'https://data.marine.copernicus.eu/products?q=Sea+ocean+colour&facets=mainVariables~Plankton',
        },
        display: [{
          name: 'CHL L4 Product',
          legendUrl: 'legends/esa/N3c.png',
          attribution: '{ E.U. Copernicus Marine Service Information; <a href="https://doi.org/10.48670/moi-00303" target="_blank"> doi:10.48670/moi-00303</a>;  <a href="https://doi.org/10.48670/moi-00300" target="_blank"> doi:10.48670/moi-00300 </a>;  <a href="https://doi.org/10.48670/moi-00287" target="_blank"> doi:10.48670/moi-00287 </a>; }',
          combinedLayers: [
            {
              ...cmemsDisplay,
              baseUrl: 'https://my.cmems-du.eu/thredds/wms/cmems_obs-oc_atl_bgc-plankton_my_l4-multi-1km_P1M?LOGSCALE=true&COLORSCALERANGE=0.03%2C30&STYLES=boxfill%2Frainbow',
              name: 'Atlantic coast CHL L4 Product',
              extent: [-45, 20, 66, 10.5],
            }, {
              ...cmemsDisplay,
              baseUrl: 'https://my.cmems-du.eu/thredds/wms/cmems_obs-oc_med_bgc-plankton_my_l4-multi-1km_P1M?LOGSCALE=true&COLORSCALERANGE=0.03%2C30&STYLES=boxfill%2Frainbow',
              name: 'Mediterranean CHL L4 Product',
              extent: [-6, 30, 37, 46],
            }, {
              ...cmemsDisplay,
              baseUrl: 'https://my.cmems-du.eu/thredds/wms/cmems_obs-oc_blk_bgc-plankton_my_l4-multi-1km_P1M?LOGSCALE=true&COLORSCALERANGE=0.03%2C30&STYLES=boxfill%2Frainbow',
              name: 'Black sea CHL L4 Product',
              extent: [26.5, 40, 42, 48],
            },
          ],
        }],
      },
    },
  },
  {
    id: 9993,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9993,
        aoi: latLng([51.954, 4.094]),
        aoiID: 'NL3',
        country: ['NL'],
        city: 'Rotterdam port',
        description: 'Oil Storage Volume',
        indicator: 'E3',
        lastIndicatorValue: null,
        indicatorName: 'Oil Storage Volume',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.09798 51.94802,4.10056 51.95410,4.08811 51.95733,4.08648 51.95378,4.09584 51.94812,4.09798 51.94802))').toJson(),
          }],
        },
        lastColorCode: null,
        time: availableDates['AWS_ICEYE-E3'],
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'AWS_ICEYE-E3',
          minZoom: 5,
          name: 'Oil silos volume change',
          features: {
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMMdd'),
            url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: [{
            ...baseLayers.cloudless,
            visible: true,
          }, baseLayers.terrainLight],
        },
      },
    },
  },
  {
    id: 9991,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9991,
        aoi: latLng([48.87, 2.78]),
        aoiID: 'FR16',
        country: ['FR'],
        city: 'Disneyland Paris',
        description: 'Volume of activity at shopping center',
        indicator: 'E11',
        lastIndicatorValue: null,
        indicatorName: 'Volume of activity at shopping center',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((2.76907 48.86129,2.76907 48.88170,2.79872 48.88170,2.79872 48.86129,2.76907 48.86129))').toJson(),
          }],
        },
        lastColorCode: null,
        time: availableDates['AWS_ICEYE-E11'],
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'AWS_ICEYE-E11',
          minZoom: 5,
          name: 'Disneyland Paris',
          features: {
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMMdd'),
            url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: [{
            ...baseLayers.cloudless,
            visible: true,
          }, baseLayers.terrainLight],
        },
      },
    },
  },
  {
    id: 9990,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9990,
        aoi: latLng([52.244, 21.045]),
        aoiID: 'PL7',
        country: ['PL'],
        city: 'Warsaw',
        description: 'Volume of activity at parking lot',
        indicator: 'E11a',
        lastIndicatorValue: null,
        indicatorName: 'Volume of activity at parking lot',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((21.03890 52.23563,21.03890 52.24898,21.05229 52.24898,21.05229 52.23563,21.03890 52.23563))').toJson(),
          }],
        },
        lastColorCode: null,
        time: availableDates['AWS_ICEYE-E11A'],
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'AWS_ICEYE-E11A',
          minZoom: 5,
          name: 'Warsaw parking lot',
          features: {
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMMdd'),
            url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: [{
            ...baseLayers.cloudless,
            visible: true,
          }, baseLayers.terrainLight],
        },
      },
    },
  },
  {
    id: 9989,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9989,
        aoi: latLng([50.604, -2.37]),
        aoiID: 'UK9',
        country: ['GB'],
        city: 'Weymouth',
        description: 'Ports and Shipping - impact on cruises',
        indicator: 'E13c',
        lastIndicatorValue: null,
        indicatorName: 'Ports and Shipping - impact on cruises',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-2.39347 50.58519,-2.39347 50.62474,-2.33785 50.62474,-2.33785 50.58519,-2.39347 50.58519))').toJson(),
          }],
        },
        lastColorCode: null,
        time: availableDates['AWS_ICEYE-E12B'],
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'AWS_ICEYE-E12B',
          minZoom: 5,
          name: 'Weimouth ships',
          features: {
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyyMMdd'),
            url: './eodash-data/features/E12b/E12b_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: [{
            ...baseLayers.cloudless,
            visible: true,
          }, baseLayers.terrainLight],
        },
      },
    },
  },
  {
    id: 9988,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9988,
        aoi: latLng([50.04, 8.5]),
        aoiID: 'DE18',
        country: ['DE'],
        city: 'Frankfurt am Main',
        description: 'Airports: Throughput',
        indicator: 'E13b',
        lastIndicatorValue: null,
        indicatorName: 'Airports: Throughput',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((8.51604 50.03769,8.51604 50.04915,8.53346 50.04915,8.53346 50.03769,8.51604 50.03769))').toJson(),
          }],
        },
        lastColorCode: null,
        time: ['2020-05-12T13:35:00'],
        inputData: [''],
        display: {
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'AWS_ICEYE-E13B',
          minZoom: 5,
          name: 'Airports: Detected planes',
          features: {
            allowedParameters: [],
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
            url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: [{
            ...baseLayers.cloudless,
            visible: true,
          }, baseLayers.terrainLight],
        },
      },
    },
  },
  {
    id: 9987,
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        id: 9987,
        aoi: latLng([40.413, -1.23]),
        aoiID: 'ES17',
        country: ['ES'],
        city: 'Teruel',
        description: 'Airports: Throughput',
        indicator: 'E13b',
        lastIndicatorValue: null,
        indicatorName: 'Airports: Throughput',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-1.24592 40.39428,-1.24592 40.42957,-1.20747 40.42957,-1.20747 40.39428,-1.24592 40.39428))').toJson(),
          }],
        },
        lastColorCode: null,
        time: ['2020-03-20T03:50:00', '2020-08-25T03:15:00'],
        inputData: [''],
        display: {
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          layers: 'AWS_ICEYE-E13B',
          minZoom: 5,
          name: 'Airports: Detected planes',
          features: {
            allowedParameters: [],
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
            url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
          },
          baseLayers: [{
            ...baseLayers.cloudless,
            visible: true,
          }, baseLayers.terrainLight],
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: false,
        id: 9987,
        aoi: null,
        aoiID: 'EU1',
        country: 'indicatorall',
        city: 'Europe',
        siteName: 'global',
        description: 'Crude Oil Storage Index (EU)',
        indicator: 'OX',
        lastIndicatorValue: null,
        indicatorName: 'Crude Oil Storage Index (EU)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: [],
        inputData: [''],
        display: {
        },
      },
    },
  },
];
