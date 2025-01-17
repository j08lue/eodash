// config global variables here for now
// temporary solution
import { Wkt } from 'wicket';
import WKB from 'ol/format/WKB';
import GeoJSON from 'ol/format/GeoJSON';
import latLng from '@/latLng';
import { DateTime } from 'luxon';
import { shTimeFunction, shS2TimeFunction, shWeeklyTimeFunction } from '@/utils';
import { baseLayers, overlayLayers } from '@/config/layers';
import availableDates from '@/config/data_dates.json';
import locations from '@/config/locations.json';
import {
  statisticalApiHeaders,
  statisticalApiBody,
  evalScriptsDefinitions,
  parseStatAPIResponse,
  nasaStatisticsConfig,
} from '@/helpers/customAreaObjects';

const wkt = new Wkt();
const wkb = new WKB();
const geojsonFormat = new GeoJSON();

export const dataPath = './data/internal/';
export const dataEndpoints = [
  {
    type: 'eox',
    provider: './data/internal/pois_trilateral.json',
  },
];

const geodbFeatures = {
  url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/eodash_{indicator}-detections?time=eq.{featuresTime}&aoi_id=eq.{aoiID}&select=geometry,time`,
  dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss"),
  callbackFunction: (responseJson) => { // geom from wkb to geojson features
    const ftrs = [];
    if (responseJson) {
      responseJson.forEach((ftr) => {
        const { geometry, ...properties } = ftr;
        // conversion to GeoJSON because followup parts of code depend on that
        const geom = geojsonFormat.writeGeometryObject(wkb.readGeometry(geometry));
        if (geom.type === 'MultiPoint' || geom.type === 'MultiPolygon') {
          geom.coordinates.forEach((coordPair) => {
            const singleGeometry = {
              type: geom.type === 'MultiPoint' ? 'Point' : 'Polygon',
              coordinates: coordPair,
            };
            ftrs.push({
              type: 'Feature',
              properties,
              geometry: singleGeometry,
            });
          });
        } else {
          ftrs.push({
            type: 'Feature',
            properties,
            geometry: geom,
          });
        }
      });
    }
    const ftrColl = {
      type: 'FeatureCollection',
      features: ftrs,
    };
    return ftrColl;
  },
};

const cloudlessBaseLayerDefault = [{
  ...baseLayers.cloudless,
  visible: true,
}, baseLayers.eoxosm, baseLayers.terrainLight];

const mapBoxHighResoSubst = [{
  ...baseLayers.mapboxHighReso,
  visible: true,
}, baseLayers.terrainLight, baseLayers.eoxosm, baseLayers.cloudless];

const sharedPalsarFNFConfig = Object.freeze({
  url: 'https://ogcpreview1.restecmap.com/examind/api/WS/wmts/JAXA_WMTS_Preview/1.0.0/WMTSCapabilities.xml',
  protocol: 'WMTSCapabilities',
  name: 'FNF PALSAR2 World Yearly',
  projection: 'EPSG:3857',
  legendUrl: './data/trilateral/fnf-map-legend.png',
  labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy'),
  attribution: '{ <a href="https://www.eorc.jaxa.jp/ALOS/en/dataset/fnf_e.htm" target="_blank">JAXA Global PALSAR-2/PALSAR/JERS-1 Mosaic and Forest/Non-Forest maps</a> is available to use with no charge under the <a href="https://earth.jaxa.jp/policy/en.html" target="_blank">JAXA Terms of Use of Research Data</a>.; }',
  minZoom: 1,
  maxZoom: 18,
  presetView: {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: wkt.read('POLYGON((-94 20,50 20,50 -40,-94 -40,-94 20))').toJson(),
    }],
  },
});

export const indicatorsDefinition = Object.freeze({
  E13c: {
    indicatorSummary: 'Changes in Ships traffic within the Port',
    story: '/data/trilateral/E13c',
    themes: ['economy'],
    features: {
      ...geodbFeatures,
      url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/eodash_E13c_tri-detections?time=eq.{featuresTime}&aoi_id=eq.{aoiID}&select=geometry,time`,
    },
    baseLayers: cloudlessBaseLayerDefault,
  },
  E1: {
    indicatorSummary: 'Status of metallic ores',
    story: '/data/trilateral/E1',
    themes: ['economy'],
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
      allowedParameters: ['TYPE_SUMMARY', 'SPEED (KNOTSx10)', 'classification'],
    },
  },
  E1_S2: {
    indicatorSummary: 'Status of metallic ores',
    story: '/data/trilateral/E1',
    themes: ['economy'],
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
  },
  E1a: {
    indicatorSummary: 'Status of non-metallic ores',
    story: '/data/trilateral/E1a',
    themes: ['economy'],
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
      allowedParameters: ['TYPE_SUMMARY', 'SPEED (KNOTSx10)', 'classification'],
    },
  },
  E1a_S2: {
    indicatorSummary: 'Status of metallic ores',
    story: '/data/trilateral/E1a',
    themes: ['economy'],
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyyMMdd'T'HHmmss"),
      url: './eodash-data/features/{indicator}/{indicator}_{aoiID}_{featuresTime}.geojson',
    },
  },
  E2: {
    indicatorSummary: 'Volume of oil stockpiled',
    themes: ['economy'],
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
  },
  E5: {
    indicatorSummary: 'Inventory levels of intermediate goods',
    themes: ['economy'],
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
  },
  E9: {
    indicatorSummary: 'Construction activity',
    story: '/data/trilateral/E9',
    themes: ['economy'],
  },
  E10a1: {
    indicatorSummary: 'Harvesting activity',
    story: '/data/trilateral/E10a1',
    themes: ['agriculture'],
  },
  E10a2: {
    indicatorSummary: 'Cum. proportion of total area under active mgmt.',
    story: '/eodash-data/stories/E10a2',
    themes: ['agriculture'],
    maxDecimals: 4,
  },
  E10a3: {
    indicatorSummary: 'Evolution of the cultivated areas for production of white asparagus',
    story: '/eodash-data/stories/E10a2',
    themes: ['agriculture'],
  },
  E10a6: {
    indicatorSummary: 'Harvested parcels/area evolution over time',
    story: '/eodash-data/stories/E10a6',
    themes: ['agriculture'],
    maxDecimals: 4,
  },
  E10a8: {
    indicatorSummary: 'Cumulative harvested area',
    story: '/eodash-data/stories/E10a8',
    themes: ['agriculture'],
  },
  E10b: {
    indicatorSummary: 'Field preparation activity',
    themes: ['agriculture'],
  },
  E10c: {
    indicatorSummary: 'Rice Planted Area',
    story: '/data/trilateral/US05-E10c',
    themes: ['agriculture'],
  },
  E10d: {
    indicatorSummary: 'Cropped Area - Regional',
    story: '/data/trilateral/E10d',
    themes: ['agriculture'],
    disableTimeSelection: true,
  },
  E10e: {
    indicatorSummary: 'NDVI GCOM-C',
    story: '/eodash-data/stories/E10e',
    themes: ['agriculture', 'biomass'],
  },
  E11: {
    indicatorSummary: 'Volume of activity at shopping centers',
    themes: ['economy'],
  },
  E12a: {
    indicatorSummary: 'Volume of activity logistic interchange centers',
    themes: ['economy'],
  },
  E12b: {
    indicatorSummary: 'Throughput at border crossing points',
    themes: ['economy'],
  },
  E13a: {
    indicatorSummary: 'Throughput at principal rail stations',
    themes: ['economy'],
  },
  E13b: {
    indicatorSummary: 'Throughput at principal hub airports',
    features: {
      // valid for default (geodb) features, NASA have 'input_data' 'airports' override
      ...geodbFeatures,
      url: `https://xcube-geodb.brockmann-consult.de/eodash/${shConfig.geodbInstanceId}/eodash_E13b_tri-detections?time=eq.{featuresTime}&aoi_id=eq.{aoiID}&select=geometry,time`,
    },
    story: '/data/trilateral/E13b',
    themes: ['economy'],
  },
  H1: {
    indicatorSummary: 'Number of temp. treatment sites',
    themes: ['covid-19'],
  },
  N1: {
    indicatorSummary: 'Air quality',
    story: '/data/trilateral/N1',
    themes: ['atmosphere'],
    largeTimeDuration: true,
    maxZoom: 8,
  },
  N9: {
    indicatorSummary: 'Air quality',
    story: '/eodash-data/stories/N9',
    themes: ['atmosphere'],
  },
  N10: {
    indicatorSummary: 'Air quality',
    story: '/eodash-data/stories/N10',
    themes: ['atmosphere'],
  },
  NASAPopulation: {
    indicatorSummary: 'Population',
    story: '/data/trilateral/NASAPopulation',
    themes: ['economy'],
  },
  WSF: {
    indicatorSummary: 'World Settlement Footprint',
    story: '/eodash-data/stories/WSF-WSF',
    themes: ['economy'],
  },
  N2: {
    indicatorSummary: 'Greenhouse Gases',
    story: '/data/trilateral/N2',
    themes: ['atmosphere'],
    largeTimeDuration: true,
  },
  N3: {
    indicatorSummary: 'Water Quality',
    themes: ['oceans'],
  },
  N3b: {
    indicatorSummary: 'Chl-a concentration anomaly',
    story: '/data/trilateral/N3b',
    themes: ['oceans'],
    sensorColorMap: {
      'Sentinel-3A OLCI': '#a37',
      'Aqua MODIS': '#47a',
      'MODIS Aqua': '#47a',
      'GCOM-C/SGLI': '#6ce',
    },
  },
  N3a2: {
    indicatorSummary: 'CHL concentration',
    story: '/eodash-data/stories/N3a2',
    themes: ['oceans'],
  },
  N4a: {
    indicatorSummary: 'Changes in land fill sites',
    themes: ['economy'],
  },
  N4b: {
    indicatorSummary: 'Illegal waste levels',
    themes: ['economy'],
  },
  N5: {
    indicatorSummary: 'Nightlights (Suomi NPP VIIRS)',
    story: '/data/trilateral/N5',
    themes: ['economy', 'atmosphere'],
  },
  N6: {
    indicatorSummary: 'Cropped Area - Global',
    story: '/data/trilateral/N6',
    themes: ['agriculture'],
  },
  N7: {
    indicatorSummary: 'Slowdown Proxy Maps',
    story: '/data/trilateral/N7',
    themes: ['economy'],
  },
  N8: {
    indicatorSummary: 'Recovery Proxy Maps',
    story: '/data/trilateral/N8',
    themes: ['economy'],
    disableTimeSelection: true,
  },
  N12: {
    indicatorSummary: 'Sea Ice Concentration (GCOM-W)',
    themes: ['cryosphere'],
    baseLayers: cloudlessBaseLayerDefault,
    story: '/eodash-data/stories/N12',
  },
  N11: {
    indicatorSummary: 'GLI Ocean Primary Productivity',
    themes: ['oceans'],
    story: '/eodash-data/stories/N11',
  },
  N13: {
    indicatorSummary: 'Blue Tarps (PlanetScope)',
    story: '/eodash-data/stories/N13',
    themes: ['economy'],
  },
  N14: {
    indicatorSummary: 'Blue Tarps Detections',
    story: '/eodash-data/stories/N14',
    themes: ['economy'],
  },
  GG: {
    indicatorSummary: 'Mobility',
    disableTimeSelection: true,
    story: '/eodash-data/stories/GG-GG',
    themes: ['economy'],
    disableCSV: true,
    alternateDataPath: './eodash-data/internal/',
  },
  CV: {
    indicatorSummary: 'Covid-19 cases',
    disableTimeSelection: true,
    story: '/eodash-data/stories/CV-CV',
    themes: ['covid-19'],
    disableCSV: true,
    alternateDataPath: './eodash-data/internal/',
  },
  OW: {
    indicatorSummary: 'Covid-19 vaccinations',
    disableTimeSelection: true,
    story: '/eodash-data/stories/OW-OW',
    themes: ['covid-19'],
    disableCSV: true,
    alternateDataPath: './eodash-data/internal/',
  },
  FB: {
    indicatorSummary: 'Facebook population density',
    themes: ['economy'],
    disableTimeSelection: true,
    baseLayers: cloudlessBaseLayerDefault,
  },
  SIF: {
    indicatorSummary: 'Solar Induced Chlorophyll Fluorescence',
    story: '/eodash-data/stories/SIF',
    themes: ['agriculture'],
    maxZoom: 8,
  },
  NPP: {
    indicatorSummary: 'Ocean Primary Productivity (BICEP)',
    story: '/eodash-data/stories/NPP',
    themes: ['oceans'],
  },
  NPPN: {
    indicatorSummary: 'Ocean Primary Productivity (NASA)',
    story: '/eodash-data/stories/NPPN',
    themes: ['oceans'],
  },
  SIE: {
    indicatorSummary: 'SIE',
    story: '/eodash-data/stories/SIE',
    themes: ['cryosphere'],
  },
  SIC: {
    indicatorSummary: 'SIC',
    story: '/eodash-data/stories/SIC',
    themes: ['cryosphere'],
  },
  SITI: {
    indicatorSummary: 'SITI',
    story: '/eodash-data/stories/SITI',
    themes: ['cryosphere'],
  },
  NCEO: {
    indicatorSummary: 'NCEO',
    story: '/eodash-data/stories/NCEO',
    themes: ['agriculture', 'biomass'],
    disableTimeSelection: true,
  },
  SMC: {
    indicatorSummary: 'SMC',
    story: '/eodash-data/stories/SMC',
    themes: ['agriculture'],
  },
  PRC: {
    indicatorSummary: 'PRC',
    story: '/eodash-data/stories/PRC',
    themes: ['agriculture'],
  },
  FNF: {
    indicatorSummary: 'FNF',
    story: '/eodash-data/stories/FNF',
    themes: ['biomass'],
  },
  PRCG: {
    indicatorSummary: 'PRCG',
    story: '/eodash-data/stories/PRCG',
    themes: ['agriculture'],
  },
  SMCG: {
    indicatorSummary: 'SMCG',
    story: '/eodash-data/stories/SMCG',
    themes: ['agriculture'],
  },
  GRDI1: {
    story: '/eodash-data/stories/GRDI1',
    themes: ['economy'],
    disableTimeSelection: true,
  },
  GRDI2: {
    story: '/eodash-data/stories/GRDI2',
    themes: ['economy'],
    disableTimeSelection: true,
  },
  GRDI3: {
    story: '/eodash-data/stories/GRDI3',
    themes: ['economy'],
    disableTimeSelection: true,
  },
  GRDI4: {
    story: '/eodash-data/stories/GRDI4',
    themes: ['economy'],
    disableTimeSelection: true,
  },
  GRDI5: {
    story: '/eodash-data/stories/GRDI5',
    themes: ['economy'],
    disableTimeSelection: true,
  },
  GRDI6: {
    story: '/eodash-data/stories/GRDI6',
    themes: ['economy'],
    disableTimeSelection: true,
  },
  GRDI7: {
    story: '/eodash-data/stories/GRDI7',
    themes: ['economy'],
    disableTimeSelection: true,
  },
  GRDI8: {
    story: '/eodash-data/stories/GRDI8',
    themes: ['economy'],
    disableTimeSelection: true,
  },
  ADD: {
    indicatorSummary: 'Antarctic cryosphere',
    themes: ['cryosphere'],
    story: '/data/trilateral/ADD',
    features: {
      url: './data/trilateral/thwaites.geojson',
    },
    mapProjection: {
      name: 'EPSG:3031',
      def: '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs',
      extent: [-3299207.53, -3333134.03, 3299207.53, 3333134.03],
    },
    projection: 'EPSG:3031',
    minZoom: 2,
    maxZoom: 15,
    baseLayers: [
      baseLayers.terrainLight,
      baseLayers.cloudless,
      baseLayers.eoxosm,
      {
        name: 'Antarctic hillshade, bathymetry',
        baseUrl: 'https://maps.bas.ac.uk/antarctic/wms',
        projection: 'EPSG:3031',
        layers: 'add:antarctic_hillshade_and_bathymetry',
        minZoom: 2,
        maxZoom: 17,
        visible: true,
        protocol: 'WMS',
        format: 'image/png',
        tileSize: 512,
        attribution: '{ REMA: Howat, I. M., Porter, C., Smith, B. E., Noh, M.-J., and Morin, P.: The Reference Elevation Model of Antarctica, The Cryosphere, 13, 665-674, https://doi.org/10.5194/tc-13-665-2019, 2019. ; GEBCO Compilation Group (2019) GEBCO 2019 Grid (doi:10.5285/836f016a-33be-6ddc-e053-6c86abc0788e) Available from: GEBCO; https://www.gebco.net/ }',
      },
    ],
    overlayLayers: [
      overlayLayers.eoxOverlay,
      {
        name: 'Antarctic coastline',
        baseUrl: 'https://maps.bas.ac.uk/antarctic/wms',
        projection: 'EPSG:3031',
        layers: 'add:antarctic_coastline_line_medium',
        attribution: '{ Gerrish, L., Fretwell, P., & Cooper, P. (2022). Medium resolution vector polylines of the Antarctic coastline (7.6) [Data set]. UK Polar Data Centre, Natural Environment Research Council, UK Research & Innovation. https://doi.org/10.5285/1db7f188-6c3e-46cf-a3bf-e39dbd77e14c }',
        minZoom: 2,
        maxZoom: 17,
        visible: true,
        protocol: 'WMS',
        format: 'image/png',
        tileSize: 512,
      },
      {
        name: 'Antarctic labels',
        baseUrl: 'https://add.data.bas.ac.uk/ogc/64/wms',
        projection: 'EPSG:3031',
        layers: 'apip_extended_toponymy_labels',
        minZoom: 2,
        maxZoom: 17,
        visible: true,
        protocol: 'WMS',
        format: 'image/png',
        tileSize: 512,
        attribution: '{ Place Names sourced from SCAR Composite Gazetteer of Antarctica }',
      },
    ],
  },
  PRCTS: {
    indicatorSummary: 'Precipitation anomaly',
    themes: ['agriculture'],
    story: '/data/trilateral/PRCTS',
  },
  SMCTS: {
    indicatorSummary: 'Soil Moisture anomaly',
    themes: ['agriculture'],
    story: '/data/trilateral/SMCTS',
  },
  VITS: {
    indicatorSummary: 'Vegetation Index',
    themes: ['agriculture'],
    story: '/data/trilateral/VITS',
  },
  d: { // dummy for locations without Indicator code
    indicatorSummary: 'Upcoming data',
    themes: ['atmosphere', 'agriculture', 'biomass', 'economy', 'oceans', 'cryosphere', 'covid-19'],
  },
});

const cairoPresetView = Object.freeze({
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    properties: {},
    geometry: wkt.read('POLYGON((30 31.4,32.1 31.6,32.2 28,31 28,30 28,29.7 31,30 31.4))').toJson(),
  }],
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
  'LANDSAT-8-TRUE-COLOUR': {
    layers: 'LANDSAT-8-TRUE-COLOUR',
  },
  'LANDSAT-8-NIR': {
    layers: 'LANDSAT-8-NIR',
  },
  'Sentinel-1': {
    layers: 'E8_SENTINEL1',
    dateFormatFunction: shS2TimeFunction,
  },
  'ALOS-2': {
    layers: 'AWS_JAXA_CARS_CONTAINERS_ALOS2',
  },
  NO2_Cairo: {
    baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
    layers: 'NO2-TROPOMI-Cairo-Daily',
    maxZoom: 14,
    legendUrl: 'legends/trilateral/NO2_Cairo.png',
    presetView: cairoPresetView,
  },
  GOSAT_XCO2_JAXA: {
    baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
    layers: 'XCO2-GOSAT-Cairo',
    maxZoom: 14,
    legendUrl: 'legends/trilateral/GOSAT_XCO2_JAXA.png',
    presetView: cairoPresetView,
  },
  SIF_TROPOMI_Cairo: {
    baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
    layers: 'SIF-TROPOMI-Cairo-Monthly',
    maxZoom: 14,
    legendUrl: 'legends/trilateral/SIF_TROPOMI_Cairo.png',
    presetView: cairoPresetView,
  },
  GOSAT_XCO2: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/xco2/GOSAT_XCO2_{time}_{site}_BG_circle_cog.tif&resampling_method=nearest',
    protocol: 'xyz',
    maxZoom: 12,
    tileSize: 256,
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
    legendUrl: 'legends/trilateral/GOSAT_XCO2.png',
  },
  airport_tk: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fairport%2Ftk_{time}.tif&resampling_method=bilinear&bidx=1',
    protocol: 'xyz',
    tileSize: 256,
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
    siteMapping: (eoID) => {
      const mapping = {
        JP02: 'tk', // just to fix transition
      };
      return mapping[eoID];
    },
  },
  industry: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Findustry%2F{site}_{time}.tif&resampling_method=bilinear&bidx=1',
    protocol: 'xyz',
    tileSize: 256,
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
    siteMapping: (eoID) => {
      const mapping = {
        SG01: 'sg',
      };
      return mapping[eoID];
    },
  },
  ports: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fplanet%2F{site}-{time}.tif&resampling_method=bilinear&bidx=1%2C2%2C3',
    protocol: 'xyz',
    tileSize: 256,
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
      allowedParameters: ['verified'],
    },
  },
  airports: {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/planet/{z}/{x}/{y}?date={time}&site={site}',
    name: 'Throughput at principal hub airports',
    protocol: 'xyz',
    tileSize: 256,
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
    siteMapping: (eoID) => {
      const mapping = {
        US021: 'la',
        US022: 'la',
        US031: 'sf',
        US032: 'sf',
        US033: 'sf',
        US034: 'sf',
        US035: 'sf',
        US036: 'sf',
        US037: 'sf',
        US041: 'ny',
        US042: 'ny',
        CN011: 'be',
        CN012: 'be',
        JP02: 'tk',
        JP012: 'tk',
      };
      return mapping[eoID];
    },
    features: {
      dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
      url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/detections/plane/{site}/{featuresTime}.geojson',
      allowedParameters: ['Country', 'label', 'score'],
    },
  },
  'SGLI L2 Reflectance 8-day composited': {
    url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fagriculture%2Fgcom-c-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-1%2C1&color_map=cfastie',
    protocol: 'xyz',
    tileSize: 256,
    legendUrl: 'legends/trilateral/NDVI_cfastie.png',
    dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
  },
  palsarFNF2017: {
    ...sharedPalsarFNFConfig,
    layers: 'FNF-PALSAR2-World-2017-Yearly',
  },
  palsarFNF2018: {
    ...sharedPalsarFNFConfig,
    layers: 'FNF-PALSAR2-World-2018-Yearly',
  },
  palsarFNF2019: {
    ...sharedPalsarFNFConfig,
    layers: 'FNF-PALSAR2-World-2019-Yearly',
  },
  palsarFNF2020: {
    ...sharedPalsarFNFConfig,
    layers: 'FNF-PALSAR2-World-2020-Yearly',
  },
});

export const indicatorClassesIcons = Object.freeze({
  economy: 'mdi-cash',
  agriculture: 'mdi-barley',
  atmosphere: 'mdi-weather-windy',
  oceans: 'mdi-water',
  biomass: 'mdi-leaf',
  'covid-19': 'mdi-hospital-box-outline',
  cryosphere: 'mdi-snowflake',
});

export const mapDefaults = Object.freeze({
  bounds: [-170, -70, 170, 70],
});

export const baseLayersLeftMap = [{
  ...baseLayers.terrainLight, visible: true,
}, baseLayers.eoxosm, baseLayers.cloudless];
export const baseLayersRightMap = [{
  ...baseLayers.terrainLight, visible: true,
}, baseLayers.eoxosm, baseLayers.cloudless];

export const overlayLayersLeftMap = [{
  ...overlayLayers.eoxOverlay,
  visible: true,
  updateOpacityOnZoom: true,
}];
export const overlayLayersRightMap = [{
  ...overlayLayers.eoxOverlay,
  visible: true,
  updateOpacityOnZoom: true,
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
  attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank"> Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
  minZoom: 7,
  visible: true,
  mapProjection: 'EPSG:3857',
  projection: 'EPSG:3857',
};

const e10cDates = {
  time: [
    '2018-03-06',
    '2018-03-14',
    '2018-03-22',
    '2018-03-30',
    '2018-04-07',
    '2018-04-15',
    '2018-04-23',
    '2018-05-01',
    '2018-05-09',
    '2018-05-17',
    '2018-05-25',
    '2018-06-02',
    '2018-06-10',
    '2018-06-18',
    '2018-06-26',
    '2018-07-04',
    '2018-07-12',
    '2018-07-20',
    '2018-07-28',
    '2019-03-06',
    '2019-03-14',
    '2019-03-22',
    '2019-03-30',
    '2019-04-07',
    '2019-04-15',
    '2019-04-23',
    '2019-05-01',
    '2019-05-09',
    '2019-05-17',
    '2019-05-25',
    '2019-06-02',
    '2019-06-10',
    '2019-06-18',
    '2019-06-26',
    '2019-07-04',
    '2019-07-12',
    '2019-07-20',
    '2019-07-28',
    '2020-03-05',
    '2020-03-13',
    '2020-03-21',
    '2020-03-29',
    '2020-04-06',
    '2020-04-14',
    '2020-04-22',
    '2020-04-30',
    '2020-05-08',
    '2020-05-16',
    '2020-05-24',
    '2020-06-01',
    '2020-06-09',
    '2020-06-17',
  ],
  eoSensor: [
    'GCOM-C SGLI',
  ],
  inputData: [
    'SGLI L2 Reflectance 8-day composited',
  ],
};

export const replaceMapTimes = {
  'US07-E10c': e10cDates,
  'US06-E10c': e10cDates,
  'US05-E10c': e10cDates,
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

export const globalIndicators = [
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Nitrogen Dioxide (Weekly/Monthly)',
        indicator: 'N1',
        indicatorName: 'Nitrogen Dioxide (Weekly)',
        eoSensor: 'ESA TROPOMI',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        aoiID: 'W1',
        time: availableDates['AWS_NO2-VISUALISATION'],
        inputData: [''],
        yAxis: 'Tropospheric NO2 (μmol/m2)',
        display: {
          customAreaIndicator: true,
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Air Quality (NO2) - ESA',
          layers: 'AWS_NO2-VISUALISATION',
          legendUrl: 'legends/esa/AWS_NO2-VISUALISATION.png',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions['AWS_NO2-VISUALISATION'],
              'byoc-972e67a7-2ca8-4bf6-964a-11fe772e3ac2',
              'P7D',
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
        description: 'Methane (Weekly)',
        indicator: 'N1',
        indicatorName: 'Methane (Weekly)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        eoSensor: 'ESA TROPOMI',
        aoiID: 'CH4',
        time: availableDates.AWS_CH4_WEEKLY,
        inputData: [''],
        yAxis: 'Tropospheric CH4 volume mixing ratio (ppbv)',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          customAreaIndicator: true,
          name: 'Air Quality (CH4) - ESA',
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
        description: 'Carbon Monoxide',
        indicator: 'N1',
        indicatorName: 'Carbon Monoxide',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'WorldCO',
        time: availableDates.AWS_VIS_CO_3DAILY_DATA,
        inputData: [''],
        yAxis: 'CO (ppbv)',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          customAreaIndicator: true,
          name: 'CO',
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
        description: 'Nitrogen Dioxide (Monthly)',
        indicator: 'N1',
        indicatorName: 'Air Quality - OMI: Monthly NO2',
        eoSensor: 'NASA OMI',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        aoiID: 'W2',
        time: availableDates['no2-monthly'],
        inputData: [''],
        yAxis: 'NO2 [µmol/m²]',
        display: {
          protocol: 'xyz',
          minZoom: 1,
          maxZoom: 6,
          tileSize: 256,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0%2C108e14&bidx=1&colormap_name=reds',
          name: 'Air Quality (NASA)',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('LLL yyyy'),
          legendUrl: 'legends/trilateral/N1_W2.png',
          customAreaIndicator: true,
          areaIndicator: nasaStatisticsConfig(
            (value) => value / 1e14,
          ),
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
        description: 'Nitrogen Dioxide (Monthly)',
        indicator: 'N1',
        lastIndicatorValue: 'OMI: Difference Nitrogen dioxide',
        indicatorName: 'Air Quality - OMI: Monthly NO2 Compared to Baseline (2015-2019)',
        eoSensor: 'NASA OMI Difference',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        lastColorCode: 'primary',
        aoiID: 'W3',
        time: availableDates['no2-monthly-diff'],
        inputData: [''],
        yAxis: 'NO2-difference [10^15 molecules/cm²]',
        display: {
          protocol: 'xyz',
          maxZoom: 6,
          minZoom: 1,
          tileSize: 256,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&bidx=1&rescale=-3e15%2C3e15&colormap_name=rdbu_r',
          name: 'Air Quality (NASA)',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('LLL yyyy'),
          legendUrl: 'legends/trilateral/N1_W3.png',
          disableCompare: true,
          customAreaIndicator: true,
          areaIndicator: nasaStatisticsConfig(
            (value) => value / 1e15,
          ),
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
        description: 'Carbon Dioxide',
        indicator: 'N2',
        indicatorName: 'Carbon Dioxide',
        calcMethod: 'Mean CO2',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        aoiID: 'W4',
        time: availableDates['co2-mean'],
        inputData: [''],
        yAxis: 'CO2 mean [ppm]',
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&bidx=1&rescale=0.000408%2C0.000419&colormap_name=rdylbu_r',
          name: 'Greenhouse Gases (NASA)',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd'),
          legendUrl: 'legends/trilateral/N2_W4.png',
          customAreaIndicator: true,
          areaIndicator: nasaStatisticsConfig(
            (value) => (value * 1e6),
          ),
        },
        // compareDisplay: {
        //   protocol: 'xyz',
        //   tileSize: 256,
        //   minZoom: 1,
        //   url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&bidx=1&rescale=0.000408%2C0.000419&colormap_name=rdylbu_r',
        //  // once the data are available on the STAC API, we probably can use this replace
        //   dateFormatFunction: (date) => `url=${date[1]}`.replace('diff', 'base'),
        // },
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
        description: 'Population Density (Meta)',
        indicator: 'FB',
        indicatorName: 'Population Density (Meta)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W7',
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/dataforgood-fb-population-density/cog.tif&rescale=0,70&resampling_method=nearest&color_map=ylorrd',
          name: 'Facebook population density',
          legendUrl: 'legends/trilateral/FB_W7.png',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((2.1 48.6,2.6 48.6,2.6 49.0,2.1 49.0,2.1 48.6))').toJson(),
            }],
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
        description: 'Greenhouse Gases',
        indicator: 'N2',
        indicatorName: 'Carbon Dioxide (CO2) Difference',
        calcMethod: 'Difference CO2',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-180 -71, 180 -71, 180 71, -180 71, -180 -71))').toJson(),
          }],
        },
        aoiID: 'W5',
        time: availableDates['co2-diff'],
        inputData: [''],
        yAxis: 'CO2 difference [ppm]',
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&bidx=1&rescale=-0.000001%2C0.000001&colormap_name=rdbu_r',
          name: 'Greenhouse Gases (NASA)',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd'),
          legendUrl: 'legends/trilateral/N2_W5.png',
          disableCompare: true,
          customAreaIndicator: true,
          areaIndicator: nasaStatisticsConfig(
            (value) => (value * 1e6),
          ),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'NPP',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Ocean Primary Productivity (BICEP)',
        indicator: 'NPP',
        indicatorName: 'Ocean Primary Productivity (BICEP)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates.BICEP_NPP_VIS_PP,
        inputData: [],
        yAxis: 'NPP',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'NPP (BICEP)',
          layers: 'BICEP_NPP_VIS_PP2',
          legendUrl: 'legends/trilateral/NPP.png',
          minZoom: 2,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('LLL yyyy'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.BICEP_NPP_VIS_PP,
              'zarr-a216afca-8a65-4072-87a5-8ed7aa21e08a',
              'P30D',
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
        description: 'Nitrogen Dioxide (Yearly)',
        indicator: 'N9',
        indicatorName: 'Nitrogen Dioxide (Yearly)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W8',
        time: availableDates['OMI_trno2-COG'],
        inputData: [''],
        yAxis: 'NO2 [10^14 molecules/cm²]',
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0,37e14&bidx=1&colormap_name=reds',
          name: 'NO2 OMI Annual',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'legends/trilateral/N9_W8.png',
          customAreaIndicator: true,
          areaIndicator: nasaStatisticsConfig(
            (value) => value / 1e14,
          ),
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
        description: 'Sea Ice Thickness (ICESat-2)',
        indicator: 'SITI',
        indicatorName: 'Sea Ice Thickness (ICESat-2)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W10',
        time: availableDates['IS2SITMOGR4-cog'],
        inputData: [''],
        showGlobe: true,
        // yAxis: 'Sea-ice thickness [m]',
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?url={time}&resampling_method=bilinear&rescale=0.0,4.0&bidx=1&colormap_name=plasma',
          name: 'Sea Ice Thickness (ICESat-2)',
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('LLL yyyy'),
          legendUrl: 'legends/trilateral/SITI-W10.png',
          mapProjection: {
            name: 'EPSG:3413',
            def: '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs',
            extent: [-3314693.24, -3314693.24, 3314693.24, 3314693.24],
          },
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-20 83,50 83,50 77,-20 77,-20 83))').toJson(),
            }],
          },
          projection: 'EPSG:3857',
          /*
          TODO: Could be activated but globe is used as visualiation in data panel
          customAreaIndicator: true,
          areaIndicator: nasaStatisticsConfig(
            (value) => value,
          ),
          */
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
        description: 'Ocean Primary Productivity (MODIS)',
        indicator: 'NPPN',
        indicatorName: 'Ocean Primary Productivity (MODIS)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W11',
        time: availableDates.MO_NPP_npp_vgpm,
        inputData: [''],
        yAxis: 'mgC/m²/day',
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0.0,1500.0&bidx=1&colormap_name=jet',
          name: 'NPP (NASA)',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('LLL yyyy'),
          legendUrl: 'legends/trilateral/NPPN-W11.png',
          customAreaIndicator: true,
          areaIndicator: nasaStatisticsConfig(
            (value) => value,
          ),
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
        description: 'Aboveground Biomass',
        indicator: 'NCEO',
        indicatorName: 'Aboveground Biomass',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W12',
        time: availableDates.nceo_africa_2017,
        inputData: [''],
        yAxis: 'mg/ha',
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 10,
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-18.27 -35.05,-18.27 37.73,51.86 37.73,51.86 -35.05,-18.27 -35.05))').toJson(),
            }],
          },
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0.0,400.0&bidx=1&colormap_name=gist_earth_r',
          name: 'NCEO Africa Biomass',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'legends/trilateral/NCEO-W12.png',
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
        description: 'GRDI Built-up Area',
        indicator: 'GRDI1',
        indicatorName: 'Global Gridded Relative Deprivation Index',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W13',
        time: availableDates['grdi-v1-built'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0.0,100.0&bidx=1&colormap_name=viridis',
          name: 'GRDI',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'legends/trilateral/GRDI1-W13.png',
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
        description: 'GRDI V1 Raster',
        indicator: 'GRDI2',
        indicatorName: 'Global Gridded Relative Deprivation Index',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W14',
        time: availableDates['grdi-v1-raster'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0.0,100.0&bidx=1&colormap_name=viridis',
          name: 'GRDI',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'legends/trilateral/GRDI1-W13.png',
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
        description: 'GRDI SHDI Constituent Raster',
        indicator: 'GRDI3',
        indicatorName: 'Global Gridded Relative Deprivation',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W15',
        time: availableDates['grdi-shdi-raster'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0.0,100.0&bidx=1&colormap_name=viridis',
          name: 'GRDI',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'legends/trilateral/GRDI1-W13.png',
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
        description: 'GRDI VNL Slope Constituent Raster',
        indicator: 'GRDI4',
        indicatorName: 'Global Gridded Relative Deprivation',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W16',
        time: availableDates['grdi-vnl-slope-raster'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0.0,100.0&bidx=1&colormap_name=viridis',
          name: 'GRDI',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'legends/trilateral/GRDI1-W13.png',
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
        description: 'GRDI VNL Constituent Raster',
        indicator: 'GRDI5',
        indicatorName: 'Global Gridded Relative Deprivation',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W17',
        time: availableDates['grdi-vnl-raster'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0.0,100.0&bidx=1&colormap_name=viridis',
          name: 'GRDI',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'legends/trilateral/GRDI1-W13.png',
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
        description: 'GRDI Filled Missing Values Count',
        indicator: 'GRDI6',
        indicatorName: 'Global Gridded Relative Deprivation',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W18',
        time: availableDates['grdi-filled-missing-values-count'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0.0,100.0&bidx=1&colormap_name=viridis',
          name: 'GRDI',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'legends/trilateral/GRDI1-W13.png',
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
        description: 'GRDI IMR Constituent Raster',
        indicator: 'GRDI7',
        indicatorName: 'Global Gridded Relative Deprivation Index',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W19',
        time: availableDates['grdi-imr-raster'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0.0,100.0&bidx=1&colormap_name=viridis',
          name: 'GRDI',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'legends/trilateral/GRDI1-W13.png',
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
        description: 'GRDI CDR Constituent Raster',
        indicator: 'GRDI8',
        indicatorName: 'Global Gridded Relative Deprivation Index',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W20',
        time: availableDates['grdi-cdr-raster'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0.0,100.0&bidx=1&colormap_name=viridis',
          name: 'GRDI',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'legends/trilateral/GRDI1-W13.png',
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
        description: 'Sulfur Dioxide (OMI/Aura)',
        indicator: 'N10',
        indicatorName: 'Sulfur Dioxide (OMI/Aura)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W9',
        time: availableDates['OMSO2PCA-COG'],
        inputData: [''],
        yAxis: 'SO2 Total Column [DU]',
        display: {
          // mosaicIndicator: true,
          // collection: 'OMSO2PCA-COG',
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          maxZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0.0,1.0&bidx=1&colormap_name=viridis',
          name: 'SO2 OMI/Aura',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'legends/trilateral/N10-W9.png',
          customAreaIndicator: true,
          areaIndicator: nasaStatisticsConfig(
            (value) => value,
          ),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'W8',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Sea Ice Thickness (Envisat)',
        indicator: 'SIE',
        indicatorName: 'Sea Ice Thickness (Envisat)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates['ESA-CCI-V2-ENVISAT'],
        inputData: [],
        yAxis: 'Sea Ice Thickness (Envisat)',
        showGlobe: true,
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Sea Ice Thickness (Envisat)',
          layers: 'ESA-CCI-V2-ENVISAT',
          legendUrl: 'legends/trilateral/SITI-W10.png',
          minZoom: 2,
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('LLL yyyy'),
          mapProjection: {
            name: 'EPSG:3413',
            def: '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs',
            extent: [-3314693.24, -3314693.24, 3314693.24, 3314693.24],
          },
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-20 83,50 83,50 77,-20 77,-20 83))').toJson(),
            }],
          },
          projection: 'EPSG:3413',
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        aoiID: 'W9',
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Sea Ice Thickness (Cryosat)',
        indicator: 'SIC',
        indicatorName: 'Sea Ice Thickness (Cryosat)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates['ESA-CCI-V2-CRYOSAT'],
        inputData: [],
        yAxis: 'ESA-CCI-V2-CRYOSAT',
        showGlobe: true,
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Sea Ice Thickness (Cryosat)',
          layers: 'ESA-CCI-V2-CRYOSAT',
          legendUrl: 'legends/trilateral/SITI-W10.png',
          minZoom: 2,
          maxZoom: 13,
          projection: 'EPSG:3413',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('LLL yyyy'),
          mapProjection: {
            name: 'EPSG:3413',
            def: '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs',
            extent: [-3314693.24, -3314693.24, 3314693.24, 3314693.24],
          },
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-20 83,50 83,50 77,-20 77,-20 83))').toJson(),
            }],
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
        description: 'Sulfur Dioxide (TROPOMI)',
        indicator: 'N1',
        indicatorName: 'Sulfur Dioxide (TROPOMI)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
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
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Population Density (SEDAC)',
        indicator: 'NASAPopulation',
        indicatorName: 'Population Density (SEDAC)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W6',
        time: ['2020-05-14T00:00:00Z'],
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Population',
          layers: 'AWS_POPULATION_DENSITY',
          legendUrl: 'legends/esa/AWS_POPULATION_DENSITY.png',
          minZoom: 1,
          maxZoom: 7,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"),
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
        description: 'World Settlement Footprint',
        indicator: 'WSF',
        indicatorName: 'World Settlement Footprint',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'WSF',
        time: getYearlyDates('1985', '2015'),
        inputData: [''],
        display: [{
          baseUrl: 'https://a.geoservice.dlr.de/eoc/land/wms/',
          name: 'DLR WSF 2019 coverage',
          layers: 'WSF_2019',
          legendUrl: 'data/trilateral/wsf_legend.png',
          minZoom: 1,
          maxZoom: 17,
          labelFormatFunction: (date) => date,
          attribution: '{ WSF Evolution Data are licensed under: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"> Attribution 4.0 International (CC BY 4.0) </a>; Copyright DLR (2021);|Contains modified Copernicus Sentinel-1 and Sentinel-2 data [2019]}',
        }, {
          baseUrl: 'https://a.geoservice.dlr.de/eoc/land/wms/',
          name: 'DLR WSF Evolution 1985-2015',
          layers: 'WSF_Evolution',
          minZoom: 1,
          maxZoom: 17,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy'),
          labelFormatFunction: (date) => date,
          specialEnvTime: true,
          attribution: '{ WSF Evolution Data are licensed under: <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"> Attribution 4.0 International (CC BY 4.0) </a>; Contains modified Landsat-5/-7 data [1985-2015] }',
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Global',
        siteName: 'global',
        description: 'Sea Ice Concentration Arctic (GCOM-W)',
        indicator: 'N12',
        indicatorName: 'Sea Ice Concentration Arctic (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'Arctic',
        time: getDailyDates('1978-11-01', '2023-01-30'),
        inputData: [''],
        display: {
          name: 'Sea Ice Concentration',
          legendUrl: 'legends/trilateral/World-SIC.png',
          baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
          layers: 'SIC_N',
          minZoom: 2,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T11:59:30.000Z'"),
          projection: 'EPSG:3411',
          mapProjection: {
            name: 'EPSG:3411',
            def: '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +x_0=0 +y_0=0 +a=6378273 +b=6356889.449 +units=m +no_defs +type=crs',
            extent: [-3314763.31, -3314763.31, 3314763.31, 3314763.31],
          },
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-20 83,50 83,50 77,-20 77,-20 83))').toJson(),
            }],
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
        city: 'Global',
        siteName: '',
        description: 'Sea Ice Concentration (GCOM-W)',
        indicator: 'N12',
        indicatorName: 'Sea Ice Concentration (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: getDailyDates('1978-11-01', '2023-01-30'),
        inputData: [''],
        showGlobe: true,
        display: [{
          name: 'Sea Ice Concentration',
          legendUrl: 'legends/trilateral/World-SIC.png',
          combinedLayers: [
            {
              baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
              name: 'SIC_N',
              layers: 'SIC_N',
              minZoom: 2,
              dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T11:59:30.000Z'"),
            }, {
              baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
              name: 'SIC_S',
              layers: 'SIC_S',
              minZoom: 2,
              dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T11:59:30.000Z'"),
            },
          ],
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Global',
        siteName: 'global',
        description: 'Sea Ice Concentration Antarctic (GCOM-W)',
        indicator: 'N12',
        indicatorName: 'Sea Ice Concentration Antarctic (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'Antarctic',
        time: getDailyDates('1978-11-01', '2023-01-30'),
        inputData: [''],
        display: {
          name: 'Sea Ice Concentration',
          legendUrl: 'legends/trilateral/World-SIC.png',
          baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
          layers: 'SIC_S',
          minZoom: 2,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T11:59:30.000Z'"),
          projection: 'EPSG:3031',
          mapProjection: {
            name: 'EPSG:3031',
            def: '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs',
            extent: [-3299207.53, -3333134.03, 3299207.53, 3333134.03],
          },
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-107 -64,125 -64,125.3125 -84,-107 -84,-107 -64))').toJson(),
            }],
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
        city: 'Global',
        siteName: 'global',
        description: 'Global NDVI',
        indicator: 'E10e',
        indicatorName: 'NDVI',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: availableDates['NDVI-GCOMC-World-Monthly'],
        inputData: [''],
        display: [{
          baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
          name: 'NDVI',
          layers: 'NDVI-GCOMC-World-Monthly',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'hh:mm:ss'.000Z'"),
          legendUrl: 'legends/trilateral/gcom_ndvi.png',
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Global',
        siteName: 'global',
        description: 'Ocean Primary Productivity (GCOM-C)',
        indicator: 'N11',
        indicatorName: 'Ocean Primary Productivity (GCOM-C)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: availableDates['ONPP-GCOMC-World-Monthly'],
        inputData: [''],
        display: [{
          baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
          name: 'ONPP-GCOMC-World-Monthly',
          layers: 'ONPP-GCOMC-World-Monthly',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'hh:mm:ss'.000Z'"),
          labelFormatFunction: (date) => DateTime.fromISO(date).toFormat('LLL yyyy'),
          legendUrl: 'legends/trilateral/N11.png',
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Global',
        siteName: 'global',
        description: 'Soil Moisture Anomaly',
        indicator: 'SMC',
        indicatorName: 'Soil Moisture Anomaly',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: availableDates['SMC-Anomaly-GCOMW-World-Monthly'],
        inputData: [''],
        display: [{
          baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
          name: 'SMC-Anomaly-GCOMW-World-Monthly',
          layers: 'SMC-Anomaly-GCOMW-World-Monthly',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'hh:mm:ss'.000Z'"),
          legendUrl: 'legends/trilateral/SMC.png',
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Global',
        siteName: 'global',
        description: 'Precipitation Anomaly',
        indicator: 'PRC',
        indicatorName: 'Precipitation Anomaly',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: availableDates['PRC-Anomaly-GSMaP-World-Monthly'],
        inputData: [''],
        display: [{
          baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
          name: 'PRC-Anomaly-GSMaP-World-Monthly',
          layers: 'PRC-Anomaly-GSMaP-World-Monthly',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'hh:mm:ss'.000Z'"),
          legendUrl: 'legends/trilateral/PRC.png',
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Global',
        siteName: 'global',
        description: 'Precipitation',
        indicator: 'PRCG',
        indicatorName: 'Precipitation',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: availableDates['PRC-GSMaP-World-Monthly'],
        inputData: [''],
        display: [{
          baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
          name: 'PRC-GSMaP-World-Monthly',
          layers: 'PRC-GSMaP-World-Monthly',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'hh:mm:ss'.000Z'"),
          legendUrl: 'legends/trilateral/PRCG.png',
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Global',
        siteName: 'global',
        description: 'Soil Moisture Content',
        indicator: 'SMCG',
        indicatorName: 'Soil Moisture Content',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: availableDates['SMC-GCOMW-World-Monthly'],
        inputData: [''],
        display: [{
          baseUrl: 'https://ogcpreview2.restecmap.com/examind/api/WS/wms/default?',
          name: 'SMC-GCOMW-World-Monthly',
          layers: 'SMC-GCOMW-World-Monthly',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat("yyyy-MM-dd'T'hh:mm:ss'.000Z'"),
          legendUrl: 'legends/trilateral/smc_gcom.png',
        }],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriatic_ESA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic',
        siteName: 'North Adriatic',
        description: 'Chlorophyll-a (Chl-a) concentration from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (Sentinel-3)',
        dataProvider: 'ESA',
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
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL',
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_CHL_MAPS,
              'byoc-7db8e19e-bf12-4203-bdd1-673455647354',
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
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriatic_NASA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic',
        siteName: 'North Adriatic',
        description: 'Chlorophyll-a (Chl-a) concentration from NASA MODIS Aqua',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (MODIS)',
        dataProvider: 'NASA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.17439 44.77803,12.19636 44.81699,12.08514 45.40526,12.42602 45.58351,13.15366 45.77914,13.60398 45.81168,13.80442 45.67566,13.82364 45.59696,13.62603 45.44300,13.54915 45.43337,13.62603 45.32346,13.71390 45.09523,13.78383 44.98060,13.83051 44.89215,14 44.5,12.23482 44.48155,12.06659 44.58146,12.17439 44.77803))').toJson(),
          }],
        },
        time: [['2020-01-01'], ['2020-01-08'], ['2020-01-15'], ['2020-01-22'], ['2020-01-29'], ['2020-02-05'], ['2020-02-12'], ['2020-02-19'], ['2020-02-26'], ['2020-03-04'], ['2020-03-11'],
          ['2020-03-18'], ['2020-03-25'], ['2020-04-01'], ['2020-04-08'], ['2020-04-15'], ['2020-04-22'], ['2020-04-29'], ['2020-05-06'], ['2020-05-13'], ['2020-05-20'], ['2020-05-27'],
          ['2020-06-03'], ['2020-06-10'], ['2020-06-17'], ['2020-06-24'], ['2020-07-01'], ['2020-07-08'], ['2020-07-15'], ['2020-07-22'], ['2020-07-29'], ['2020-08-05'], ['2020-08-12'],
          ['2020-09-02'], ['2020-09-09'], ['2020-09-16'], ['2020-09-23'], ['2020-09-30'], ['2020-10-14'], ['2020-10-21'], ['2020-10-28'], ['2020-11-11'], ['2020-11-18'], ['2020-11-25'],
          ['2020-12-09'], ['2020-12-16'], ['2020-12-23'], ['2020-12-30'], ['2021-01-06'], ['2021-01-13'], ['2021-01-20'], ['2021-01-27'], ['2021-02-03'], ['2021-02-10'], ['2021-02-17'],
          ['2021-02-24'], ['2021-03-03'], ['2021-03-10'], ['2021-03-17'], ['2021-03-24'], ['2021-03-31'], ['2021-04-07'], ['2021-04-14'], ['2021-04-21'], ['2021-04-21'], ['2021-04-28'],
          ['2021-05-05'], ['2021-05-12'], ['2021-05-19'], ['2021-05-26'], ['2021-06-02'], ['2021-06-09'], ['2021-06-16'], ['2021-06-23'], ['2021-06-30'], ['2021-07-07'], ['2021-07-14'],
          ['2021-07-21'], ['2021-07-28'], ['2021-08-04'], ['2021-08-11'], ['2021-08-18'], ['2021-08-25'], ['2021-09-01'], ['2021-10-06'], ['2021-10-13'], ['2021-10-20'], ['2021-10-27'],
          ['2021-11-03'], ['2021-11-10'], ['2021-11-17'], ['2021-11-24'], ['2021-12-01'], ['2021-12-08'], ['2021-12-15'], ['2021-12-22'], ['2021-12-29'], ['2022-01-05'], ['2022-01-12'],
          ['2022-01-19'], ['2022-01-26'], ['2022-02-02'], ['2022-02-09'], ['2022-02-16'], ['2022-02-23'], ['2022-03-02'], ['2022-03-09'], ['2022-03-16']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-nas-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: 'legends/trilateral/N3a2_NASA.png',
          tileSize: 256,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriatic_JAXA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic',
        siteName: 'North Adriatic',
        description: 'Chlorophyll-a (Chl-a) concentration from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (GCOM-W)',
        dataProvider: 'JAXA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.17439 44.77803,12.19636 44.81699,12.08514 45.40526,12.42602 45.58351,13.15366 45.77914,13.60398 45.81168,13.80442 45.67566,13.82364 45.59696,13.62603 45.44300,13.54915 45.43337,13.62603 45.32346,13.71390 45.09523,13.78383 44.98060,13.83051 44.89215,13.8 44.5,12.23482 44.48155,12.06659 44.58146,12.17439 44.77803))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_CHLA_NorthAdriatic_JAXA,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_CHLA',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_CHL_MAPS,
              'byoc-7db8e19e-bf12-4203-bdd1-673455647354',
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
        aoi: latLng([37.7775, -122.41638]),
        aoiID: 'US03',
        country: ['US'],
        city: 'San Francisco',
        siteName: 'San Francisco',
        description: 'Chlorophyll-a (Chl-a) concentration from NASA MODIS Aqua',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (MODIS)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.60330 37.39634,-122.60330 38.15399,-121.69693 38.15399,-121.69693 37.39634,-122.60330 37.39634))').toJson(),
          }],
        },
        time: [['2020-03-02'], ['2020-04-03'], ['2020-04-19'], ['2020-05-04'], ['2020-05-05'], ['2020-05-19'], ['2020-05-21'], ['2020-05-24'], ['2020-06-01'], ['2020-06-03'], ['2020-06-06'], ['2020-06-13'], ['2020-06-18'], ['2020-06-21'], ['2020-06-22'], ['2020-06-23'], ['2020-06-26'], ['2020-06-28'], ['2020-07-01'], ['2020-07-03'], ['2020-07-06'], ['2020-07-08'], ['2020-07-13'], ['2020-08-09'], ['2020-08-27'], ['2020-09-06'], ['2020-10-03'], ['2020-10-12'], ['2020-10-19'], ['2020-10-21'], ['2020-10-26'], ['2020-10-28'], ['2020-11-29'], ['2020-12-06'], ['2020-12-15'], ['2020-12-22'], ['2020-12-31'], ['2021-01-07'], ['2021-01-09'], ['2021-01-14'], ['2021-01-16'], ['2021-01-19'], ['2021-01-23'], ['2021-01-29'], ['2021-02-01'], ['2021-02-03'], ['2021-02-08'], ['2021-02-17'], ['2021-02-23'], ['2021-02-24'], ['2021-02-28'], ['2021-03-05'], ['2021-03-12'], ['2021-03-21'], ['2021-03-25'], ['2021-04-06'], ['2021-04-09'], ['2021-04-14'], ['2021-04-24']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-sf-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Regional Maps',
          legendUrl: 'legends/trilateral/N3a2_NASA.png',
          tileSize: 256,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([41.0114, -73.09]),
        aoiID: 'US04',
        country: ['US'],
        city: 'New York',
        siteName: 'New York',
        description: 'Chlorophyll-a (Chl-a) concentration from NASA MODIS Aqua',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (MODIS)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-74.16735 40.17179,-74.16735 41.53390,-70.97122 41.53390,-70.97122 40.17179,-74.16735 40.17179))').toJson(),
          }],
        },
        time: getWeeklyDates('2020-01-01', '2022-03-16').filter((item) => !['2020-08-19', '2020-08-26'].includes(item)),
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/oc3_chla_anomaly/anomaly-chl-ny-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: 'legends/trilateral/N3a2_NASA.png',
          tileSize: 256,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([35.61, 139.78]),
        aoiID: 'JP01',
        country: ['JP'],
        city: 'Tokyo',
        siteName: 'Tokyo',
        description: 'Chlorophyll-a (Chl-a) concentration from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((139.24347 34.83871,139.24347 35.69310,140.26520 35.69310,140.26520 34.83871,139.24347 34.83871))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_CHLA_JP01,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_CHLA',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_CHL_MAPS,
              'byoc-7db8e19e-bf12-4203-bdd1-673455647354',
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
        aoi: latLng([43.4, 4.94]),
        aoiID: 'RhoneDelta',
        country: ['FR'],
        city: 'Rhone Delta',
        siteName: 'Fos-sur-Mer',
        description: 'Chlorophyll-a (Chl-a) concentration from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (Sentinel-3)',
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
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL',
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_CHL_MAPS,
              'byoc-7db8e19e-bf12-4203-bdd1-673455647354',
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
        aoi: latLng([34.7, 136.9]),
        aoiID: 'JP04',
        country: ['JP'],
        city: 'Nagoya',
        siteName: 'Nagoya',
        description: 'Chlorophyll-a (Chl-a) concentration from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((136.4 34.2, 137.4 34.2, 137.4 35.2, 136.4 35.2, 136.4 34.2))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_CHLA_JP04,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_CHLA',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_CHL_MAPS,
              'byoc-7db8e19e-bf12-4203-bdd1-673455647354',
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
        aoi: latLng([34.35, 135]),
        aoiID: 'JP02',
        country: ['JP'],
        city: 'Kobe',
        siteName: 'Kobe',
        description: 'Chlorophyll-a (Chl-a) concentration from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((134.5 33.85, 135.5 33.85, 135.5 34.85, 134.5 34.85, 134.5 33.85))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_CHLA_JP02,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_CHLA',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_CHL_MAPS,
              'byoc-7db8e19e-bf12-4203-bdd1-673455647354',
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
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriaticTSM_ESA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic',
        siteName: 'North Adriatic',
        description: 'Total Suspended Matter (TSM) from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (Sentinel-3)',
        dataProvider: 'ESA',
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
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL_TSMNN',
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_TSM_MAPS,
              'byoc-698ade22-bc30-44d1-8751-159ee135f998',
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
        aoi: latLng([45.05, 29.9]),
        aoiID: 'DanubeDelta',
        country: ['RO'],
        city: 'Danube Delta - Chlorophyll-a concentration',
        siteName: 'Danube Delta',
        description: 'Chlorophyll-a (Chl-a) concentration from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'Chl-a concentration (Sentinel-3)',
        dataProvider: 'ESA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((28.981 45.011,28.985 44.39,30.63 44.39,30.62 45.616,29.59 45.61,29.586 44.88,29.266 44.83,29.19 44.86,29.12 45.024,28.981 45.011))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL',
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_CHL_MAPS,
              'byoc-7db8e19e-bf12-4203-bdd1-673455647354',
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
        aoi: latLng([45.05, 29.9]),
        aoiID: 'DanubeDelta',
        country: ['RO'],
        city: 'Danube Delta - TSM concentration',
        siteName: 'Danube Delta',
        description: 'Total Suspended Matter (TSM) concentration from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (Sentinel-3)',
        dataProvider: 'ESA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((28.981 45.011,28.985 44.39,30.63 44.39,30.62 45.616,29.59 45.61,29.586 44.88,29.266 44.83,29.19 44.86,29.12 45.024,28.981 45.011))').toJson(),
          }],
        },
        time: availableDates.AWS_N3_CUSTOM,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL_TSMNN',
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_TSM_MAPS,
              'byoc-698ade22-bc30-44d1-8751-159ee135f998',
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
        aoi: latLng([43.4, 4.94000]),
        aoiID: 'RhoneDeltaTSM',
        country: ['FR'],
        city: 'Rhone Delta',
        siteName: 'Fos-sur-Mer',
        description: 'Total Suspended Matter (TSM) from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (Sentinel-3)',
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
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL_TSMNN',
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_TSM_MAPS,
              'byoc-698ade22-bc30-44d1-8751-159ee135f998',
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
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriaticSST',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic - Sea Surface Temperature',
        siteName: 'North Adriatic',
        description: 'Multi-sensor product',
        indicator: 'N3a2',
        indicatorName: 'Sea Surface Temperature Anomaly Regional Maps',
        eoSensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.17439 44.77803,12.19636 44.81699,12.08514 45.40526,12.42602 45.58351,13.15366 45.77914,13.60398 45.81168,13.80442 45.67566,13.82364 45.59696,13.62603 45.44300,13.54915 45.43337,13.62603 45.32346,13.71390 45.09523,13.78383 44.98060,13.83051 44.89215,13.83938 44.49919,12.23482 44.48155,12.06659 44.58146,12.17439 44.77803))').toJson(),
          }],
        },
        time: availableDates.AWS_VIS_SST_MAPS,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Sea Surface Temperature Anomaly [%]',
          layers: 'AWS_VIS_SST_MAPS',
          legendUrl: 'legends/esa/AWS_VIS_SST_MAPS.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_SST_MAPS,
              'byoc-92780d01-126f-4827-80f8-4e561dd8e228',
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
        aoi: latLng([43.4, 4.94]),
        aoiID: 'RhoneDeltaSST',
        country: ['FR'],
        city: 'Rhone Delta - Sea Surface Temperature',
        siteName: 'Fos-sur-Mer',
        description: 'Multi-sensor product',
        indicator: 'N3a2',
        indicatorName: 'Sea Surface Temperature Anomaly Regional Maps',
        sensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19585 43.49375, 4.19491 43.49564, 4.62253 43.49564, 4.69632 43.49753, 4.69537 43.48618, 4.67361 43.46442, 4.64523 43.45401, 4.67172 43.42090, 4.70389 43.41428, 4.71146 43.43698, 4.75592 43.43320, 4.78525 43.41806, 4.81647 43.38495, 4.83918 43.38495, 4.82877 43.40671, 4.81552 43.42469, 4.81836 43.43604, 4.86661 43.41050, 4.87040 43.41523, 4.84012 43.44928, 4.85999 43.46821, 4.88459 43.42942, 4.89499 43.43793, 4.91297 43.43509, 4.92621 43.44172, 4.94608 43.49280, 5.21949 43.49753, 5.23558 43.48996, 5.24693 43.46726, 5.23842 43.43415, 5.21476 43.41428, 5.16557 43.39157, 5.08988 43.39157, 5.01420 43.39252, 5.01893 43.37927, 5.03690 43.35657, 5.07096 43.34143, 5.11070 43.33859, 5.15327 43.34427, 5.21760 43.34049, 5.27247 43.35373, 5.30275 43.37265, 5.33208 43.36698, 5.35194 43.35657, 5.36140 43.34143, 5.36992 43.32535, 5.36992 43.31305, 5.36613 43.29791, 5.36613 43.28845, 5.37654 43.27521, 5.38600 43.26102, 5.38316 43.25250, 5.37276 43.24210, 5.35478 43.23263, 5.35005 43.22128, 5.35857 43.21088, 5.37749 43.21655, 5.39925 43.21939, 5.42195 43.21561, 5.45412 43.21939, 5.50331 43.20141, 5.50615 42.99990, 4.19301 42.99896, 4.19585 43.49375))').toJson(),
          }],
        },
        time: availableDates.AWS_VIS_SST_MAPS,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Sea Surface Temperature Anomaly [%]',
          layers: 'AWS_VIS_SST_MAPS',
          legendUrl: 'legends/esa/AWS_VIS_SST_MAPS.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_SST_MAPS,
              'byoc-92780d01-126f-4827-80f8-4e561dd8e228',
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
        aoi: latLng([40.985, 1.769]),
        aoiID: 'BarcelonaSST',
        country: ['ES'],
        city: 'Barcelona - Sea Surface Temperature',
        siteName: 'Barcelona',
        description: 'Multi-sensor product',
        indicator: 'N3a2',
        indicatorName: 'Sea Surface Temperature Anomaly Regional Maps',
        sensor: null,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((2.51654 40.48551,2.52203 41.56245,2.29138 41.48024,2.21137 41.41621,2.16469 41.3132,2.04936 41.27401,1.91756 41.26782,1.69241 41.21208,1.44803 41.17489,1.26680 41.12942,1.16796 41.07770,0.95079 41.02793,0.72612 40.81047,0.84918 40.72269,0.85468 40.68523,0.65970 40.6644,0.54987 40.57688,0.48396 40.48501,2.51654 40.48551))').toJson(),
          }],
        },
        time: availableDates.AWS_VIS_SST_MAPS,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Sea Surface Temperature Anomaly [%]',
          layers: 'AWS_VIS_SST_MAPS',
          legendUrl: 'legends/esa/AWS_VIS_SST_MAPS.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_SST_MAPS,
              'byoc-92780d01-126f-4827-80f8-4e561dd8e228',
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
        aoi: latLng([45.05, 29.9]),
        aoiID: 'DanubeDeltaSST',
        country: ['RO'],
        city: 'Danube Delta  - Sea Surface Temperature',
        siteName: 'Danube Delta',
        description: 'Multi-sensor product',
        indicator: 'N3a2',
        indicatorName: 'Sea Surface Temperature Anomaly Regional Maps',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((28.981 45.011,28.985 44.39,30.63 44.39,30.62 45.616,29.59 45.61,29.586 44.88,29.266 44.83,29.19 44.86,29.12 45.024,28.981 45.011))').toJson(),
          }],
        },
        yAxis: '%',
        time: availableDates.AWS_VIS_SST_MAPS,
        inputData: [''],
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Sea Surface Temperature Anomaly [%]',
          layers: 'AWS_VIS_SST_MAPS',
          legendUrl: 'legends/esa/AWS_VIS_SST_MAPS.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_SST_MAPS,
              'byoc-92780d01-126f-4827-80f8-4e561dd8e228',
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
        aoi: latLng([37.7775, -122.41638]),
        aoiID: 'US03SPM',
        country: ['US'],
        city: 'San Francisco',
        siteName: 'San Francisco',
        description: 'Total Suspended Matter (TSM) from NASA MODIS Aqua',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (MODIS)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.60330 37.39634,-122.60330 38.15399,-121.69693 38.15399,-121.69693 37.39634,-122.60330 37.39634))').toJson(),
          }],
        },
        time: [['2020_03_02'], ['2020_04_03'], ['2020_04_19'], ['2020_05_04'], ['2020_05_05'], ['2020_05_21'], ['2020_05_24'], ['2020_05_28'], ['2020-06-01'], ['2020-06-03'], ['2020-06-06'], ['2020-06-13'], ['2020-06-21'], ['2020-06-22'], ['2020-06-23'], ['2020-06-25'], ['2020-06-28'], ['2020-07-01'], ['2020-07-03'], ['2020-08-09'], ['2020-08-27'], ['2020-09-16'], ['2020-09-17'], ['2020-09-21'], ['2020-09-26'], ['2020-10-01'], ['2020-10-03'], ['2020-10-12'], ['2020-10-19'], ['2020-10-21'], ['2020-10-26'], ['2020-10-28'], ['2020-11-29'], ['2020-12-06'], ['2020-12-22'], ['2020-12-31'], ['2021-01-07'], ['2021-01-09'], ['2021-01-14'], ['2021-01-16'], ['2021-01-19'], ['2021-01-23'], ['2021-01-29'], ['2021-02-01'], ['2021-02-03'], ['2021-02-08'], ['2021-02-17'], ['2021-02-23'], ['2021-02-24'], ['2021-02-28'], ['2021-03-05'], ['2021-03-12'], ['2021-03-21'], ['2021-03-25'], ['2021-04-06'], ['2021-04-09'], ['2021-04-14'], ['2021-04-24']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxZoom: 18,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/spm_anomaly/anomaly-spm-sf-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Regional Maps',
          legendUrl: 'legends/trilateral/N3a2_NASA_TSMNN.png',
          tileSize: 256,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriaticTSM_JAXA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic',
        siteName: 'North Adriatic',
        description: 'Total Suspended Matter (TSM) from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (GCOM-W)',
        dataProvider: 'JAXA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.17439 44.77803,12.19636 44.81699,12.08514 45.40526,12.42602 45.58351,13.15366 45.77914,13.60398 45.81168,13.80442 45.67566,13.82364 45.59696,13.62603 45.44300,13.54915 45.43337,13.62603 45.32346,13.71390 45.09523,13.78383 44.98060,13.83051 44.89215,13.8 44.5,12.23482 44.48155,12.06659 44.58146,12.17439 44.77803))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_TSM_NorthAdriaticTSM_JAXA,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_TSM',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_CHL_MAPS,
              'byoc-7db8e19e-bf12-4203-bdd1-673455647354',
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
        aoi: latLng([35.61, 139.78]),
        aoiID: 'JP01TSM',
        country: ['JP'],
        city: 'Tokyo',
        siteName: 'Tokyo',
        description: 'Total Suspended Matter (TSM) from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((139.24347 34.83871,139.24347 35.69310,140.26520 35.69310,140.26520 34.83871,139.24347 34.83871))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_TSM_JP01TSM,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_TSM',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_TSM_MAPS,
              'byoc-698ade22-bc30-44d1-8751-159ee135f998',
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
        aoi: latLng([34.7, 136.9]),
        aoiID: 'JP04TSM',
        country: ['JP'],
        city: 'Nagoya',
        siteName: 'Nagoya',
        description: 'Total Suspended Matter (TSM) from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((136.4 34.2, 137.4 34.2, 137.4 35.2, 136.4 35.2, 136.4 34.2))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_TSM_JP04TSM,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_TSM',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_TSM_MAPS,
              'byoc-698ade22-bc30-44d1-8751-159ee135f998',
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
        aoi: latLng([34.35, 135]),
        aoiID: 'JP02TSM',
        country: ['JP'],
        city: 'Kobe',
        siteName: 'Kobe',
        description: 'Total Suspended Matter (TSM) from JAXA GCOM-W',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (GCOM-W)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((134.5 33.85, 135.5 33.85, 135.5 34.85, 134.5 34.85, 134.5 33.85))').toJson(),
          }],
        },
        time: availableDates.AWS_JAXA_TSM_JP02TSM,
        inputData: [''],
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_JAXA_TSM',
          maxZoom: 13,
          legendUrl: 'legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_TSM_MAPS,
              'byoc-698ade22-bc30-44d1-8751-159ee135f998',
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
        aoi: latLng([45.19752, 13.02978]),
        aoiID: 'NorthAdriaticTSM_NASA',
        country: ['HR', 'IT', 'SI'],
        city: 'North Adriatic',
        siteName: 'North Adriatic',
        description: 'Total Suspended Matter (TSM) from NASA MODIS Aqua',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (MODIS)',
        dataProvider: 'NASA',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((12.17439 44.77803,12.19636 44.81699,12.08514 45.40526,12.42602 45.58351,13.15366 45.77914,13.60398 45.81168,13.80442 45.67566,13.82364 45.59696,13.62603 45.44300,13.54915 45.43337,13.62603 45.32346,13.71390 45.09523,13.78383 44.98060,13.83051 44.89215,14 44.5,12.23482 44.48155,12.06659 44.58146,12.17439 44.77803))').toJson(),
          }],
        },
        time: [['2020-01-01'], ['2020-01-08'], ['2020-01-15'], ['2020-01-22'], ['2020-01-29'], ['2020-02-05'], ['2020-02-12'], ['2020-02-19'], ['2020-02-26'], ['2020-03-04'], ['2020-03-11'], ['2020-03-18'], ['2020-03-25'], ['2020-04-01'],
          ['2020-04-08'], ['2020-04-15'], ['2020-04-22'], ['2020-04-29'], ['2020-05-06'], ['2020-05-13'], ['2020-05-20'], ['2020-05-27'], ['2020-06-03'], ['2020-06-10'], ['2020-06-17'], ['2020-06-24'], ['2020-07-01'], ['2020-07-08'],
          ['2020-07-15'], ['2020-07-22'], ['2020-07-29'], ['2020-08-05'], ['2020-08-12'], ['2020-09-02'], ['2020-09-09'], ['2020-09-16'], ['2020-09-23'], ['2020-09-30'], ['2020-10-14'], ['2020-10-21'], ['2020-10-28'], ['2020-11-11'],
          ['2020-11-18'], ['2020-11-25'], ['2020-12-16'], ['2020-12-23'], ['2020-12-30'], ['2021-01-06'], ['2021-01-13'], ['2021-01-20'], ['2021-01-27'], ['2021-02-03'], ['2021-02-10'], ['2021-02-17'], ['2021-02-24'], ['2021-03-03'],
          ['2021-03-10'], ['2021-03-17'], ['2021-03-24'], ['2021-03-31'], ['2021-04-07'], ['2021-04-14'], ['2021-04-21'], ['2021-04-28'], ['2021-05-05'], ['2021-05-12'], ['2021-05-19'], ['2021-05-26'], ['2021-06-02'], ['2021-06-09'],
          ['2021-06-16'], ['2021-06-23'], ['2021-06-30'], ['2021-07-07'], ['2021-07-14'], ['2021-07-21'], ['2021-07-28'], ['2021-08-04'], ['2021-08-11'], ['2021-08-18'], ['2021-08-25'], ['2021-09-01'], ['2021-10-06'], ['2021-10-13'],
          ['2021-10-20'], ['2021-10-27'], ['2021-11-03'], ['2021-11-10'], ['2021-11-17'], ['2021-11-24'], ['2021-12-01'], ['2021-12-08'], ['2021-12-15'], ['2021-12-22'], ['2021-12-29'], ['2022-01-05'], ['2022-01-12'], ['2022-01-19'],
          ['2022-01-26'], ['2022-02-02'], ['2022-02-09'], ['2022-02-16'], ['2022-02-23'], ['2022-03-02'], ['2022-03-09'], ['2022-03-16']],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/spm_anomaly/anomaly-spm-nas-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: 'legends/trilateral/N3a2_NASA_TSMNN.png',
          tileSize: 256,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([41.0114, -73.09]),
        aoiID: 'US04TSM',
        country: ['US'],
        city: 'New York',
        siteName: 'New York',
        description: 'Total Suspended Matter (TSM) from NASA MODIS Aqua',
        indicator: 'N3a2',
        indicatorName: 'TSM concentration (MODIS)',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-74.16735 40.17179,-74.16735 41.53390,-70.97122 41.53390,-70.97122 40.17179,-74.16735 40.17179))').toJson(),
          }],
        },
        time: getWeeklyDates('2020-01-01', '2022-03-16').filter((item) => !['2020-08-19', '2020-08-26'].includes(item)),
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/spm_anomaly/anomaly-spm-ny-{time}.tif&resampling_method=bilinear&bidx=1&rescale=-100%2C100&color_map=rdbu_r',
          name: 'Water Quality Index',
          legendUrl: 'legends/trilateral/N3a2_NASA_TSMNN.png',
          tileSize: 256,
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
        description: 'GEOGLAM Crop Conditions',
        indicator: 'N6',
        indicatorName: 'Cropped Area',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'W6',
        time: availableDates.geoglam,
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxZoom: 6,
          minZoom: 1,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=nearest&bidx=1&colormap=%7B%221%22%3A%20%5B120%2C%20120%2C%20120%2C%20255%5D%2C%222%22%3A%20%5B130%2C%2065%2C%200%2C%20255%5D%2C%223%22%3A%20%5B66%2C%20207%2C%2056%2C%20255%5D%2C%224%22%3A%20%5B245%2C%20239%2C%200%2C%20255%5D%2C%225%22%3A%20%5B241%2C%2089%2C%2032%2C%20255%5D%2C%226%22%3A%20%5B168%2C%200%2C%200%2C%20255%5D%2C%227%22%3A%20%5B0%2C%20143%2C%20201%2C%20255%5D%7D',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('LLL yyyy'),
          name: 'Agriculture GEOGLAM',
          legendUrl: './data/trilateral/agriculture-GEOGLAM-legend.png',
          tileSize: 256,
          features: {
            url: './eodash-data/features/{indicator}/{indicator}_{aoiID}.geojson',
            allowedParameters: ['ADM0_NAME', 'Name'],
            style: {
              color: '#696868',
              opacity: 0.5,
            },
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([6.13333, 1.21666]),
        aoiID: 'TG01',
        country: ['TG'],
        city: 'Togo',
        siteName: 'Togo',
        description: 'Regional Cropland',
        indicator: 'E10d',
        indicatorName: 'Regional Cropland',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: { type: 'MultiPolygon', coordinates: [[[[0.0, 11.11002], [0.50285, 11.00908], [0.48997, 10.98623], [0.50584, 10.98011], [0.49468, 10.931], [0.65631, 10.99735], [0.91216, 10.99649], [0.89052, 10.92094], [0.90098, 10.88674], [0.88508, 10.86182], [0.87382, 10.80496], [0.80183, 10.71829], [0.79693, 10.68492], [0.80757, 10.59096], [0.78323, 10.51218], [0.77457, 10.38476], [1.05682, 10.17935], [1.3552, 10.0], [1.3693, 9.6615], [1.36606, 9.61139], [1.34159, 9.54626], [1.36109, 9.48638], [1.39021, 9.4973], [1.40114, 9.43463], [1.40312, 9.35491], [1.42092, 9.30743], [1.44741, 9.28273], [1.47767, 9.23691], [1.52597, 9.1907], [1.55912, 9.17015], [1.6176, 9.07092], [1.62974, 8.99912], [1.62241, 8.95456], [1.63311, 8.79376], [1.63112, 8.51869], [1.65019, 8.47767], [1.6302, 8.44951], [1.61974, 8.3741], [1.63347, 8.31899], [1.63145, 7.66111], [1.65051, 7.61399], [1.65293, 7.53402], [1.67753, 7.49791], [1.65334, 7.4945], [1.64388, 7.48555], [1.63642, 7.41777], [1.64203, 6.99457], [1.55783, 6.99749], [1.55918, 6.97219], [1.57411, 6.94711], [1.5779, 6.923], [1.60622, 6.90186], [1.60669, 6.88347], [1.5945, 6.86898], [1.5996, 6.83013], [1.61479, 6.82508], [1.59662, 6.80644], [1.61274, 6.79243], [1.60838, 6.77127], [1.6261, 6.76024], [1.61691, 6.74], [1.59253, 6.7255], [1.59209, 6.70642], [1.57392, 6.68824], [1.58957, 6.68388], [1.60284, 6.66628], [1.61123, 6.64192], [1.60247, 6.62745], [1.6098, 6.60582], [1.61715, 6.59684], [1.6344, 6.59682], [1.65129, 6.57836], [1.67429, 6.5832], [1.66856, 6.55767], [1.68397, 6.56043], [1.69801, 6.54802], [1.70193, 6.51536], [1.69573, 6.50041], [1.71759, 6.49329], [1.72794, 6.49835], [1.73393, 6.47582], [1.75062, 6.46392], [1.74716, 6.45404], [1.75518, 6.43678], [1.77608, 6.41604], [1.76941, 6.41168], [1.77234, 6.3774], [1.78919, 6.35048], [1.78275, 6.33898], [1.79794, 6.31276], [1.78921, 6.30287], [1.80669, 6.28424], [1.79933, 6.28056], [1.7699, 6.28216], [1.76392, 6.27181], [1.64567, 6.24809], [1.62956, 6.24237], [1.62786, 6.23429], [1.37822, 6.17636], [1.29450, 6.14846], [1.28008, 6.14063], [1.28518, 6.13522], [1.19960, 6.11242], [1.20031, 6.16855], [1.08543, 6.16807], [1.08341, 6.18768], [1.06582, 6.21904], [1.02430, 6.25416], [1.00853, 6.29193], [1.00530, 6.33270], [0.89387, 6.33324], [0.88455, 6.35492], [0.85681, 6.38359], [0.82826, 6.40011], [0.78814, 6.40898], [0.78133, 6.43232], [0.74816, 6.44292], [0.74430, 6.48135], [0.72524, 6.49074], [0.71233, 6.52842], [0.74409, 6.55870], [0.74097, 6.58266], [0.72707, 6.59173], [0.71030, 6.58676], [0.68781, 6.59244], [0.68435, 6.59773], [0.69086, 6.59880], [0.67258, 6.61464], [0.65659, 6.60865], [0.63811, 6.63530], [0.64846, 6.71099], [0.64215, 6.72053], [0.65095, 6.73716], [0.62164, 6.75413], [0.60810, 6.74761], [0.58005, 6.76374], [0.56622, 6.78446], [0.56707, 6.80348], [0.57651, 6.79912], [0.58058, 6.80788], [0.54887, 6.83399], [0.53952, 6.82529], [0.53283, 6.82897], [0.53247, 6.85600], [0.54365, 6.86406], [0.53480, 6.87742], [0.55861, 6.88775], [0.56554, 6.91891], [0.54751, 6.93719], [0.52279, 6.94117], [0.52184, 6.97124], [0.54808, 6.99163], [0.57830, 6.99442], [0.59517, 7.00798], [0.60171, 7.03649], [0.59591, 7.06100], [0.61368, 7.10135], [0.59291, 7.11525], [0.60609, 7.15922], [0.61725, 7.16200], [0.61668, 7.18342], [0.62929, 7.19615], [0.64545, 7.29036], [0.65883, 7.31818], [0.64429, 7.39872], [0.61871, 7.41264], [0.59691, 7.39879], [0.56679, 7.39579], [0.53812, 7.42461], [0.53295, 7.45866], [0.52122, 7.45649], [0.51994, 7.46289], [0.52803, 7.48376], [0.52037, 7.51553], [0.53072, 7.58886], [0.52132, 7.59453], [0.58842, 7.62734], [0.59456, 7.70324], [0.61117, 7.71079], [0.63206, 7.70649], [0.62002, 7.74638], [0.61136, 7.75131], [0.63280, 7.77708], [0.62813, 7.79628], [0.61723, 7.80166], [0.62423, 7.86481], [0.60952, 7.94454], [0.59615, 7.97669], [0.59898, 8.02442], [0.58345, 8.09505], [0.59101, 8.13831], [0.60581, 8.14478], [0.61144, 8.18369], [0.60129, 8.18126], [0.59039, 8.19156], [0.58768, 8.20789], [0.61871, 8.21609], [0.63779, 8.25895], [0.67246, 8.26447], [0.68443, 8.28291], [0.72635, 8.28465], [0.73107, 8.34627], [0.71044, 8.35717], [0.71046, 8.38542], [0.69809, 8.39572], [0.70572, 8.40100], [0.69297, 8.40098], [0.68517, 8.41737], [0.65016, 8.42782], [0.65414, 8.46032], [0.64267, 8.47948], [0.64376, 8.49490], [0.62727, 8.49820], [0.62761, 8.50846], [0.61759, 8.51396], [0.56824, 8.52533], [0.55863, 8.55017], [0.53859, 8.55562], [0.52800, 8.56973], [0.51056, 8.56347], [0.49022, 8.59719], [0.47123, 8.59538], [0.37531, 8.75342], [0.40103, 8.75754], [0.38117, 8.77084], [0.38321, 8.79195], [0.41864, 8.79247], [0.42771, 8.78034], [0.44225, 8.78904], [0.43121, 8.79794], [0.45057, 8.81296], [0.46633, 8.79271], [0.48981, 8.80092], [0.49797, 8.81491], [0.49519, 8.83963], [0.51998, 8.85624], [0.52422, 8.88023], [0.50920, 8.90254], [0.51144, 8.93679], [0.49276, 8.95418], [0.46646, 9.00623], [0.45452, 9.05033], [0.46316, 9.05538], [0.46582, 9.09124], [0.48301, 9.10161], [0.47456, 9.14449], [0.49088, 9.15596], [0.50142, 9.15351], [0.53093, 9.20657], [0.50409, 9.25720], [0.53759, 9.30325], [0.55463, 9.30746], [0.54444, 9.34374], [0.56450, 9.40369], [0.55104, 9.42272], [0.52415, 9.43014], [0.51798, 9.43923], [0.49876, 9.43695], [0.49331, 9.44925], [0.50406, 9.46500], [0.50042, 9.47371], [0.48796, 9.48613], [0.45602, 9.49724], [0.41372, 9.49948], [0.38623, 9.49068], [0.35996, 9.49862], [0.34509, 9.48566], [0.35035, 9.47312], [0.33741, 9.45044], [0.28537, 9.42898], [0.26514, 9.42805], [0.24906, 9.43652], [0.23086, 9.46434], [0.23254, 9.48596], [0.27023, 9.47711], [0.31436, 9.50531], [0.29472, 9.52273], [0.24551, 9.52247], [0.23818, 9.54170], [0.24288, 9.57171], [0.26791, 9.56375], [0.29079, 9.57314], [0.35830, 9.56921], [0.38406, 9.58608], [0.37401, 9.60641], [0.38279, 9.64030], [0.36995, 9.65035], [0.36253, 9.67205], [0.35189, 9.67417], [0.34523, 9.71515], [0.32049, 9.72459], [0.32751, 9.77052], [0.33607, 9.77620], [0.33195, 9.79369], [0.35772, 9.84547], [0.35496, 9.91883], [0.38685, 9.93696], [0.35934, 9.98355], [0.35965, 10.02814], [0.40929, 10.02017], [0.41712, 10.05667], [0.39432, 10.08004], [0.36125, 10.08522], [0.35316, 10.10178], [0.36374, 10.13381], [0.35120, 10.16739], [0.36241, 10.26011], [0.38249, 10.27261], [0.36953, 10.28443], [0.39782, 10.30642], [0.38975, 10.31463], [0.32144, 10.30751], [0.33890, 10.32507], [0.33424, 10.33521], [0.31951, 10.33526], [0.31425, 10.36131], [0.29481, 10.37347], [0.30257, 10.39141], [0.28896, 10.41737], [0.27509, 10.41849], [0.25565, 10.40550], [0.21953, 10.42363], [0.20734, 10.41521], [0.21010, 10.40357], [0.19333, 10.40157], [0.18517, 10.41987], [0.17334, 10.42558], [0.17515, 10.44619], [0.15773, 10.46265], [0.16232, 10.47255], [0.14345, 10.52538], [0.06141, 10.56050], [0.05627, 10.58251], [0.04064, 10.60002], [-0.05955, 10.63105], [-0.09068, 10.70726], [-0.07271, 10.71999], [-0.06974, 10.76870], [-0.02193, 10.81983], [-0.02881, 10.85969], [-0.00725, 10.91389], [-0.00587, 10.95960], [0.03238, 10.97740], [0.02275, 11.08191], [0.00987, 11.10144], [-0.00219, 11.10512], [-0.04895, 11.10285], [-0.09375, 11.08863], [-0.14302, 11.10149], [-0.14732, 11.11248], [-0.14201, 11.13898], [0.0, 11.11002]]]] },
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          minZoom: 6,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/Togo/togo_cropland_v7-1_cog_v2.tif&resampling_method=bilinear&bidx=1&rescale=0,1&color_map=magma',
          name: 'Togo',
          legendUrl: './legends/trilateral/TG01-E10d.png',
          tileSize: 256,
          disableCompare: true,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([39.9, 116.38]),
        aoiID: 'CN01',
        country: ['CN'],
        city: 'Beijing',
        siteName: 'Beijing',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((116.07330 39.76632,116.07330 40.21244,116.72973 40.21244,116.72973 39.76632,116.07330 39.76632))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-be.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([38.90472, -77.01638]),
        aoiID: 'US10',
        country: ['US'],
        city: 'Washington, D.C.',
        siteName: 'Washington, D.C.',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-78.1073 38.43207,-78.1073 39.84650,-75.81665 39.84650,-75.81665 38.43207,-78.1073 38.43207))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-dc.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([51.03613, 2.28537]),
        aoiID: 'FR03',
        country: ['FR'],
        city: 'Port of Dunkirk',
        siteName: 'Port of Dunkirk',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((1.59059 50.73317,1.55490 50.87717,1.73736 50.95414,2.04078 51.01463,2.30437 51.06383,2.50345 51.08280,2.90296 51.24205,3.14734 51.34076,3.60589 51.36905,3.78379 50.85797,2.62231 50.72956,2.57014 50.84064,1.59059 50.73317))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-du.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([51.09155, 3.74008]),
        aoiID: 'BE03',
        country: ['BE'],
        city: 'Port of Ghent',
        siteName: 'Port of Ghent',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((4.19612 51.38292,4.33341 51.41247,4.44187 51.28043,4.63779 50.92072,4.12278 50.84820,3.39652 50.72981,3.22898 51.27339,3.71924 51.35408,3.85245 51.34550,3.90876 51.37295,3.95133 51.41408,4.01999 51.40979,4.05844 51.37552,4.19612 51.38292))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-gh.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([35.61, 139.78]),
        aoiID: 'JP01',
        country: ['JP'],
        city: 'Tokyo',
        siteName: 'Tokyo',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((138.70513 34.89269,138.70513 36.46105,140.90240 36.46105,140.90240 34.89269,138.70513 34.89269))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-tk.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([6.13333, 1.21666]),
        aoiID: 'TG01',
        country: ['TG'],
        city: 'Togo',
        siteName: 'Togo',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-0.89538 11.34271,-0.71960 10.23384,-0.28564 8.48867,-0.00137 6.31120,0.24444 5.71984,0.88439 5.74580,1.14807 6.01901,1.51062 6.18151,1.97204 6.25523,2.29202 6.28390,2.30850 7.075,2.28241 7.54493,2.15744 8.59867,1.57379 9.62106,1.30874 10.26897,1.59576 11.05308,1.32934 11.47464,0.81024 11.63340,0.23620 11.59036,-0.34881 11.47060,-0.89538 11.34271))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-togo.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([34.05, -118.25]),
        aoiID: 'US02',
        country: ['US'],
        city: 'Los Angeles',
        siteName: 'Los Angeles',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-118.76220 33.53217,-118.95172 34.37965,-117.95471 34.54270,-117.94647 34.42497,-116.99615 34.56758,-116.83548 34.00482,-116.76544 33.40390,-118.76220 33.53217))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-la.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([-6.8, 39.28333]),
        aoiID: 'TZ01',
        country: ['TZ'],
        city: 'Dar El Salam',
        siteName: 'Dar El Salam',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((38.64561 -6.64517,38.64561 -6.4528,38.87615 -6.40213,39.04747 -6.45859,39.29809 -6.70893,39.50271 -6.87939,39.56949 -7.01946,39.53653 -7.20206,39.43508 -7.22386,39.25226 -7.24940,38.96919 -7.30594,38.78757 -7.33420,38.74088 -7.06341,38.67239 -6.78616,38.64561 -6.64517))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-dar.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([41.0114, -73.09]),
        aoiID: 'US04',
        country: ['US'],
        city: 'New York',
        siteName: 'New York',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-75.14099 40.24599,-75.38269 41.13729,-72.89428 41.69342,-71.5979 40.87614,-75.14099 40.24599))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-ny.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([37.7775, -122.41638]),
        aoiID: 'US03',
        country: ['US'],
        city: 'San Francisco',
        siteName: 'San Francisco',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.63968 37.09977,-122.63968 38.19095,-120.95375 38.19095,-120.95375 37.09977,-122.63968 37.09977))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-sf.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([38.715, -121.944]),
        aoiID: 'US06',
        country: ['US'],
        city: 'Sacramento',
        siteName: 'Sacramento',
        description: 'Recovery Proxy Maps',
        indicator: 'N8',
        lastIndicatorValue: 'normal',
        indicatorName: 'Recovery Proxy Maps',
        lastColorCode: 'BLUE',
        eoSensor: ['Recovery Proxy Maps'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-120.8 38, -120.8 40, -122.8 40, -122.8 38, -120.8 38))').toJson(),
          }],
        },
        time: ['TBD'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3://covid-eo-data/rpm/rpm-sacramento.cog.tif&resampling_method=bilinear&bidx=1%2C2%2C3%24',
          name: 'Recovery Proxy Maps',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N8.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([33.94, -118.41]),
        aoiID: 'US021',
        country: ['US'],
        city: 'Los Angeles',
        siteName: 'Los Angeles International Airport - LAX',
        description: 'Airports: throughput',
        indicator: 'E13b',
        lastIndicatorValue: 'normal',
        indicatorName: 'Los Angeles International Airport - LAX, Throughput at principal hub airports',
        lastColorCode: 'BLUE',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-118.44 33.93, -118.38 33.93, -118.38 33.95, -118.44 33.95, -118.44 33.93))').toJson(),
          }],
        },
        time: [['2020-01-10'], ['2020-02-01'], ['2020-04-21'], ['2020-05-05'], ['2020-05-17'], ['2020-05-20'], ['2020-06-08'], ['2020-06-15'], ['2020-07-04'], ['2020-07-10'], ['2020-08-18'], ['2020-08-28'], ['2020-09-22'], ['2020-09-30'], ['2020-10-02'], ['2020-10-15']],
        inputData: ['airports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([34.057, -117.6]),
        aoiID: 'US022',
        country: ['US'],
        city: 'Ontario',
        siteName: 'Ontario International Airport - ONT',
        description: 'Airports: throughput',
        indicator: 'E13b',
        lastIndicatorValue: 'normal',
        indicatorName: 'Ontario International Airport - ONT, Throughput at principal hub airports',
        lastColorCode: 'BLUE',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-117.575 34.048, -117.63 34.048, -117.63 34.065, -117.575 34.065, -117.575 34.048))').toJson(),
          }],
        },
        time: [['2020-01-14'], ['2020-02-03'], ['2020-03-22'], ['2020-04-15'], ['2020-05-04'], ['2020-05-23'], ['2020-05-24'], ['2020-06-11'], ['2020-07-06'], ['2020-07-21'], ['2020-08-01'], ['2020-08-16'], ['2020-09-01'], ['2020-09-19'], ['2020-10-04'], ['2020-10-27']],
        inputData: ['airports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([37.622, -122.378]),
        aoiID: 'US031',
        country: ['US'],
        city: 'San Francisco',
        siteName: 'San Francisco International Airport - SFO',
        description: 'Airports: throughput',
        indicator: 'E13b',
        lastIndicatorValue: 'normal',
        indicatorName: 'San Francisco International Airport - SFO, Throughput at principal hub airports',
        lastColorCode: 'BLUE',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.4 37.605, -122.355 37.605, -122.355 37.64, -122.4 37.64, -122.4 37.605))').toJson(),
          }],
        },
        time: [['2020-01-11'], ['2020-02-20'], ['2020-03-09'], ['2020-04-03'], ['2020-05-05'], ['2020-05-19'], ['2020-05-26'], ['2020-06-04'], ['2020-06-23'], ['2020-07-06'], ['2020-07-14'], ['2020-08-07'], ['2020-08-13'], ['2020-09-23'], ['2020-09-30'], ['2020-10-12'], ['2020-10-26']],
        inputData: ['airports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([37.363, -121.93]),
        aoiID: 'US032',
        country: ['US'],
        city: 'San Jose',
        siteName: 'Norman Y. Mineta San Jose International Airport - SJC',
        description: 'Airports: throughput',
        indicator: 'E13b',
        lastIndicatorValue: 'normal',
        indicatorName: 'Norman Y. Mineta San Jose International Airport - SJC, Throughput at principal hub airports',
        lastColorCode: 'BLUE',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-121.945 37.35, -121.912 37.35, -121.912 37.377, -121.945 37.377, -121.945 37.35))').toJson(),
          }],
        },
        time: [['2020-01-12'], ['2020-02-10'], ['2020-03-12'], ['2020-04-07'], ['2020-05-07'], ['2020-05-16'], ['2020-05-29'], ['2020-06-21'], ['2020-06-29'], ['2020-07-22'], ['2020-07-31'], ['2020-08-03'], ['2020-08-08'], ['2020-10-20'], ['2020-10-31']],
        inputData: ['airports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([37.722, -122.226]),
        aoiID: 'US033',
        country: ['US'],
        city: 'Oakland',
        siteName: 'Oakland International Airport - OAK',
        description: 'Airports: throughput',
        indicator: 'E13b',
        lastIndicatorValue: 'normal',
        indicatorName: 'Oakland International Airport - OAK, Throughput at principal hub airports',
        lastColorCode: 'BLUE',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.252 37.7, -122.2 37.7, -122.2 37.745, -122.252 37.745, -122.252 37.7))').toJson(),
          }],
        },
        time: [['2020-01-13'], ['2020-02-15'], ['2020-03-19'], ['2020-04-15'], ['2020-05-04'], ['2020-05-27'], ['2020-06-11'], ['2020-06-18'], ['2020-07-07'], ['2020-07-27'], ['2020-08-04'], ['2020-09-22'], ['2020-09-24'], ['2020-10-15']],
        inputData: ['airports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([37.6585, -122.121]),
        aoiID: 'US034',
        country: ['US'],
        city: 'Hayward',
        siteName: 'Hayward Executive Airport - HWD',
        description: 'Airports: throughput',
        indicator: 'E13b',
        lastIndicatorValue: 'normal',
        indicatorName: 'Hayward Executive Airport - HWD, Throughput at principal hub airports',
        lastColorCode: 'BLUE',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.132 37.653, -122.11 37.653, -122.11 37.664, -122.132 37.664, -122.132 37.653))').toJson(),
          }],
        },
        time: [['2020-01-13'], ['2020-02-18'], ['2020-03-12'], ['2020-04-22'], ['2020-05-19']],
        inputData: ['airports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([38.216, -122.276]),
        aoiID: 'US035',
        country: ['US'],
        city: 'Napa',
        siteName: 'Napa County Airport - APC',
        description: 'Airports: throughput',
        indicator: 'E13b',
        lastIndicatorValue: 'normal',
        indicatorName: 'Napa County Airport - APC, Throughput at principal hub airports',
        lastColorCode: 'BLUE',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.286 38.206, -122.266 38.206, -122.266 38.226, -122.286 38.226, -122.286 38.206))').toJson(),
          }],
        },
        time: [['2020-01-13'], ['2020-02-06'], ['2020-03-10'], ['2020-04-07'], ['2020-06-28'], ['2020-07-17'], ['2020-07-25'], ['2020-08-09'], ['2020-09-04'], ['2020-10-21'], ['2020-10-28']],
        inputData: ['airports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([38.144, -122.557]),
        aoiID: 'US036',
        country: ['US'],
        city: 'Marin',
        siteName: 'Marin County Airport - NOT',
        description: 'Airports: throughput',
        indicator: 'E13b',
        lastIndicatorValue: 'normal',
        indicatorName: 'Marin County Airport - NOT, Throughput at principal hub airports',
        lastColorCode: 'BLUE',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.565 38.137, -122.55 38.137, -122.55 38.150, -122.565 38.150, -122.565 38.137))').toJson(),
          }],
        },
        time: [['2020-02-07'], ['2020-03-12'], ['2020-04-02']],
        inputData: ['airports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([37.99, -122.057]),
        aoiID: 'US037',
        country: ['US'],
        city: 'Buchannan',
        siteName: 'Buchannan Field Airport - CCR',
        description: 'Airports: throughput',
        indicator: 'E13b',
        lastIndicatorValue: 'normal',
        indicatorName: 'Buchannan Field Airport - CCR, Throughput at principal hub airports',
        lastColorCode: 'BLUE',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.064 37.98, -122.05 37.98, -122.05 38.0, -122.064 38.0, -122.064 37.98))').toJson(),
          }],
        },
        time: [['2020-03-12']],
        inputData: ['airports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([40.642, -73.788]),
        aoiID: 'US041',
        country: ['US'],
        city: 'New York',
        siteName: 'John F. Kennedy International Airport - JFK',
        description: 'Airports: throughput',
        indicator: 'E13b',
        lastIndicatorValue: 'normal',
        indicatorName: 'John F. Kennedy International Airport - JFK, Throughput at principal hub airports',
        lastColorCode: 'BLUE',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-73.825 40.62, -73.753 40.62, -73.753 40.664, -73.825 40.664, -73.825 40.62))').toJson(),
          }],
        },
        time: [['2020-01-16'], ['2020-02-17'], ['2020-03-15'], ['2020-04-15'], ['2020-05-14'], ['2020-05-27'], ['2020-05-30'], ['2020-06-04'], ['2020-06-10'], ['2020-07-02'], ['2020-07-06'], ['2020-08-10'], ['2020-08-26'], ['2020-09-16'], ['2020-09-25'], ['2020-10-06']],
        inputData: ['airports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([40.689, -74.172]),
        aoiID: 'US042',
        country: ['US'],
        city: 'Newark',
        siteName: 'Newark Liberty International Airport - EWR',
        description: 'Airports: throughput',
        indicator: 'E13b',
        lastIndicatorValue: 'normal',
        indicatorName: 'Newark Liberty International Airport - EWR, Throughput at principal hub airports',
        lastColorCode: 'BLUE',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-74.19 40.67, -74.155 40.67, -74.155 40.708, -74.19 40.708, -74.19 40.67))').toJson(),
          }],
        },
        time: [['2020-01-20'], ['2020-02-19'], ['2020-03-09'], ['2020-04-06'], ['2020-05-05'], ['2020-05-20'], ['2020-05-31'], ['2020-06-01'], ['2020-06-09'], ['2020-07-19'], ['2020-07-21'], ['2020-08-03'], ['2020-08-17'], ['2020-09-13'], ['2020-09-21'], ['2020-10-08'], ['2020-10-15']],
        inputData: ['airports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([40.072, 116.593]),
        aoiID: 'CN011',
        country: ['CN'],
        city: 'Beijing',
        siteName: 'Beijing Capital International Airport - PEK',
        description: 'Airports: throughput',
        indicator: 'E13b',
        lastIndicatorValue: 'normal',
        indicatorName: 'Beijing Capital International Airport - PEK, Throughput at principal hub airports',
        lastColorCode: 'BLUE',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((116.566 40.05, 116.621 40.05, 116.621 40.105, 116.566 40.105, 116.566 40.05))').toJson(),
          }],
        },
        time: [['2020-01-12'], ['2020-02-10'], ['2020-03-12'], ['2020-04-11'], ['2020-05-05']],
        inputData: ['airports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([39.495, 116.419]),
        aoiID: 'CN012',
        country: ['CN'],
        city: 'Beijing Daxing',
        siteName: 'Beijing Daxing International Airport - PKX',
        description: 'Airports: throughput',
        indicator: 'E13b',
        lastIndicatorValue: 'normal',
        indicatorName: 'Beijing Daxing International Airport - PKX, Throughput at principal hub airports',
        lastColorCode: 'BLUE',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((116.362 39.466, 116.476 39.466, 116.476 39.524, 116.362 39.524, 116.362 39.466))').toJson(),
          }],
        },
        time: [['2020-01-09'], ['2020-01-12'], ['2020-01-14'], ['2020-02-18'], ['2020-03-13'], ['2020-03-19'], ['2020-04-11'], ['2020-05-14']],
        inputData: ['airports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([35.774, 140.385]),
        aoiID: 'JP012',
        country: ['JP'],
        city: 'Narita',
        siteName: 'Narita International Airport - NRT',
        description: 'Airports: throughput',
        indicator: 'E13b',
        lastIndicatorValue: 'normal',
        indicatorName: 'Narita International Airport - NRT, Throughput at principal hub airports',
        lastColorCode: 'BLUE',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((140.364 35.742, 140.406 35.742, 140.406 35.806, 140.364 35.806, 140.364 35.742))').toJson(),
          }],
        },
        time: [['2020-01-19'], ['2020-02-05'], ['2020-03-19'], ['2020-04-10'], ['2020-05-16'], ['2020-08-11'], ['2020-08-11'], ['2020-08-14'], ['2020-09-02'], ['2020-09-09'], ['2020-09-10'], ['2020-10-02'], ['2020-10-22'], ['2020-10-25']],
        inputData: ['airports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([34.05, -118.251]),
        aoiID: 'US02',
        country: ['US'],
        city: 'Los Angeles',
        siteName: 'Los Angeles',
        description: 'Ports: Ship throughput',
        indicator: 'E13c',
        lastIndicatorValue: 'normal',
        indicatorName: 'Number of Ships in Port',
        lastColorCode: 'BLUE',
        eoSensor: ['Planet Labs/NASA (PlanetScope)'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-118.78075 33.42020,-118.78075 33.95016,-117.92406 33.95016,-117.92406 33.42020,-118.78075 33.42020))').toJson(),
          }],
        },
        time: ['2020-01-01', '2020-01-06', '2020-01-07', '2020-01-09', '2020-01-10', '2020-01-12', '2020-01-13', '2020-01-14', '2020-01-17', '2020-01-18', '2020-01-19', '2020-01-22', '2020-01-23', '2020-01-24', '2020-01-27', '2020-01-28', '2020-01-29', '2020-01-30', '2020-01-31', '2020-02-02', '2020-02-03', '2020-02-27', '2020-02-29', '2020-03-03', '2020-03-08', '2020-03-15', '2020-03-21', '2020-03-22', '2020-03-27', '2020-04-23', '2020-04-24', '2020-05-01', '2020-05-02', '2020-05-03', '2020-05-04', '2020-05-05', '2020-05-06', '2020-05-07', '2020-05-08', '2020-05-09', '2020-05-11', '2020-05-12', '2020-05-13', '2020-05-14', '2020-05-15', '2020-05-16', '2020-05-17', '2020-05-19', '2020-05-20', '2020-05-21', '2021-06-23', '2021-08-27', '2021-10-09', '2021-10-15'],
        inputData: ['ports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([40.6, -74.05]),
        aoiID: 'US01',
        country: ['US'],
        city: 'New York',
        siteName: 'New York',
        description: 'Ports: Ship throughput',
        indicator: 'E13c',
        lastIndicatorValue: 'normal',
        indicatorName: 'Number of Ships in Port',
        lastColorCode: 'BLUE',
        eoSensor: ['Planet Labs/NASA (PlanetScope)'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-73.97302 40.77222,-74.03550 40.76234,-74.11241 40.66345,-74.19480 40.64366,-74.30329 40.50440,-74.22639 40.44643,-73.99087 40.40461,-73.79311 40.39520,-73.64617 40.44695,-73.61665 40.58319,-73.75123 40.59519,-73.79174 40.66033,-73.87895 40.65720,-73.97576 40.61187,-74.00117 40.66189,-73.93868 40.74830,-73.97302 40.77222))').toJson(),
          }],
        },
        time: ['2020-01-02', '2020-01-09', '2020-01-11', '2020-01-16', '2020-01-17', '2020-01-19', '2020-01-20', '2020-01-21', '2020-01-22', '2020-01-23', '2020-01-24', '2020-01-30', '2020-02-02', '2020-02-03', '2020-02-29', '2020-03-08', '2020-03-18', '2020-03-22', '2020-03-27', '2020-05-02', '2020-05-05', '2020-05-09', '2020-05-10', '2020-05-13', '2020-05-14', '2020-05-16', '2020-05-19', '2020-05-20', '2020-05-21'],
        inputData: ['ports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([37.7775, -122.41638]),
        aoiID: 'US03',
        country: ['US'],
        city: 'San Francisco',
        siteName: 'San Francisco',
        description: 'Ports: Ship throughput',
        indicator: 'E13c',
        lastIndicatorValue: 'normal',
        indicatorName: 'Number of Ships in Port',
        lastColorCode: 'BLUE',
        eoSensor: ['Planet Labs/NASA (PlanetScope)'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((-122.63488 37.61314, -122.25654 37.61314, -122.25654 37.88081, -122.63488 37.88081, -122.63488 37.61314))').toJson(),
          }],
        },
        time: ['2020-01-02', '2020-01-03', '2020-01-05', '2020-01-07', '2020-01-10', '2020-01-11', '2020-01-12', '2020-01-13', '2020-01-14', '2020-01-17', '2020-01-18', '2020-01-22', '2020-01-23', '2020-01-27', '2020-01-30', '2020-01-31', '2020-02-03', '2020-02-27', '2020-02-29', '2020-03-03', '2020-03-08', '2020-03-10', '2020-03-11', '2020-04-21', '2020-05-01', '2020-05-03', '2020-05-04', '2020-05-05', '2020-05-06', '2020-05-07', '2020-05-08', '2020-05-09', '2020-05-15', '2020-05-16', '2020-05-17', '2020-05-19', '2020-05-20', '2020-05-21'],
        inputData: ['ports'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi: latLng([40.985, 1.769]),
        aoiID: 'BarcelonaTSM_ESA',
        country: ['ES'],
        city: 'Barcelona - Total Suspended Matter',
        siteName: 'Barcelona',
        description: 'Total Suspended Matter (TSM) from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'Water Quality Regional Maps (ESA)',
        dataProvider: 'ESA',
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
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL_TSMNN',
          legendUrl: './legends/trilateral/AWS_N3_CUSTOM_TRILATERAL_TSMNN.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_TSM_MAPS,
              'byoc-698ade22-bc30-44d1-8751-159ee135f998',
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
        aoi: latLng([40.985, 1.769]),
        aoiID: 'Barcelona_ESA',
        country: ['ES'],
        city: 'Barcelona - Chlorophyll-a concentration',
        siteName: 'Barcelona',
        description: 'Chlorophyll-a (Chl-a) concentration from ESA Sentinel-3',
        indicator: 'N3a2',
        indicatorName: 'Water Quality Regional Maps (ESA)',
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
        yAxis: '%',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Water Quality Index',
          layers: 'AWS_N3_CUSTOM_TRILATERAL',
          legendUrl: './legends/trilateral/AWS_N3_CUSTOM_TRILATERAL.png',
          maxZoom: 13,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          customAreaIndicator: true,
          areaIndicator: {
            ...statisticalApiHeaders,
            ...statisticalApiBody(
              evalScriptsDefinitions.AWS_VIS_CHL_MAPS,
              'byoc-7db8e19e-bf12-4203-bdd1-673455647354',
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
        aoi: latLng([30.05, 32.56]),
        aoiID: 'EG01',
        country: ['EG'],
        city: 'Suez',
        siteName: 'Suez Canal',
        description: 'Ports: Ship throughput',
        indicator: 'E13c',
        lastIndicatorValue: 'normal',
        indicatorName: 'Number of Ships in Port',
        lastColorCode: 'BLUE',
        eoSensor: ['Planet Labs/NASA (PlanetScope)'],
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: wkt.read('POLYGON((32.11595 30.28275,31.88249 31.09994,31.95115 31.72112,32.73942 31.67906,32.78062 31.56211,32.59111 30.32306,32.65428 29.99058,32.64878 29.81916,32.44554 29.84060,32.39335 30.15221,32.11595 30.28275))').toJson(),
          }],
        },
        time: ['2020-01-01', '2020-01-02', '2020-01-03', '2020-01-04', '2020-01-05', '2020-01-06', '2020-01-07', '2020-01-08', '2020-01-09', '2020-01-12', '2020-01-13', '2020-01-14', '2020-01-15', '2020-01-17', '2020-01-18', '2020-01-19', '2020-01-21', '2020-01-22', '2020-01-23', '2020-01-24', '2020-01-25', '2020-01-26', '2020-01-27', '2020-01-28', '2020-01-29', '2020-01-30', '2020-01-31', '2020-02-02', '2020-02-03', '2020-02-27', '2020-02-29', '2020-03-03', '2020-03-08', '2020-04-21', '2020-04-23', '2020-04-24', '2020-05-01', '2020-05-02', '2020-05-03', '2020-05-04', '2020-05-05', '2020-05-06', '2020-05-08', '2020-05-09', '2020-05-10', '2020-05-11', '2020-05-12', '2020-05-13', '2020-05-14', '2020-05-15', '2020-05-16', '2020-05-17', '2020-05-19', '2020-05-20', '2020-05-21', '2020-08-06', '2020-08-07', '2020-08-08', '2020-08-09', '2020-08-10'],
        inputData: [''],
        display: {
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/planet/{z}/{x}/{y}?date={time}&site=sc',
          protocol: 'xyz',
          tileSize: 256,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          features: {
            dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
            url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/detections/ship/sc/{featuresTime}.geojson',
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
        description: 'Forest/non-forest map PALSAR2',
        indicator: 'FNF',
        indicatorName: 'Forest/non-forest map PALSAR2',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        aoiID: 'World',
        time: getYearlyDates('2017-01-01', '2020-01-01'),
        inputData: ['palsarFNF2017', 'palsarFNF2018', 'palsarFNF2019', 'palsarFNF2020'],
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoiID: 'S1GRD',
        country: 'all',
        city: 'Antarctica',
        siteName: 'global',
        description: 'West Antarctica (Sentinel-1)',
        indicator: 'ADD',
        indicatorName: 'West Antarctica (Sentinel-1)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: getWeeklyDates('2017-05-18', '2022-01-15'),
        inputData: [''],
        display: {
          dateFormatFunction: shWeeklyTimeFunction,
          minZoom: 5,
          maxZoom: 18,
          layers: 'SENTINEL-1-EW',
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-103 -74,-102 -74,-102 -75,-103 -75,-103 -75))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoiID: 'Meltmap',
        country: 'all',
        city: 'Antarctica',
        siteName: 'global',
        description: 'Antarctica Meltmap',
        indicator: 'ADD',
        indicatorName: 'Antarctica Meltmap',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: getDailyDates('2007-01-02', '2021-12-31'),
        inputData: [''],
        display: {
          legendUrl: 'legends/trilateral/VIS_ANTARTICA_MELTMAP.png',
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Antarctica Meltmap',
          layers: 'VIS_ANTARTICA_MELTMAP',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-75 -63,-40 -63,-40 -80,-75 -80,-75 -63))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoiID: 'Days',
        country: 'all',
        city: 'Antarctica',
        siteName: 'global',
        description: 'Antarctica Melt Duration',
        indicator: 'ADD',
        indicatorName: 'Antarctica Melt Duration',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: getYearlyDates('2007-01-01', '2021-02-01'),
        inputData: [''],
        display: {
          legendUrl: 'legends/trilateral/VIS_ANTARTICA_DAYS.png',
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Antarctica Melt Duration',
          layers: 'VIS_4D_ANTARTICA_DAYS',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-75 -63,-40 -63,-40 -80,-75 -80,-75 -63))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoiID: 'End',
        country: 'all',
        city: 'Antarctica',
        siteName: 'global',
        description: 'Antarctica Melt Season End',
        indicator: 'ADD',
        indicatorName: 'Antarctica Melt Season End',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: getYearlyDates('2007-01-02', '2021-12-31'),
        inputData: [''],
        display: {
          legendUrl: 'legends/trilateral/VIS_ANTARTICA_END.png',
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Antarctic Melt Season End',
          layers: 'VIS_4D_ANTARTICA_END',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-75 -63,-40 -63,-40 -80,-75 -80,-75 -63))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoiID: 'Onset',
        country: 'all',
        city: 'Antarctica',
        siteName: 'global',
        description: 'Antarctica Melt Onset',
        indicator: 'ADD',
        indicatorName: 'Antarctica Melt Onset',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: getYearlyDates('2007-01-02', '2021-12-31'),
        inputData: [''],
        display: {
          legendUrl: 'legends/trilateral/VIS_ANTARTICA_ONSET.png',
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Antarctica Melt Onset',
          layers: 'VIS_4D_ANTARTICA_ONSET',
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy-MM-dd'),
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-75 -63,-40 -63,-40 -80,-75 -80,-75 -63))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoiID: 'ThwaitesLandsat',
        country: 'all',
        city: 'Antarctica',
        siteName: 'global',
        description: 'Thwaites Glacier Landsat L2 low-cloud scenes',
        indicator: 'ADD',
        indicatorName: 'Thwaites Glacier Landsat L2',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates['landsat-c2l2-sr-antarctic-glaciers-thwaites'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxZoom: 18,
          minZoom: 7,
          projection: 'EPSG:3857',
          attribution: 'Landsat Data Policy: https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/atoms/files/Landsat_Data_Policy.pdf',
          url: 'https://dev-raster.delta-backend.com/stac/tiles/WebMercatorQuad/{z}/{x}/{y}@2x?collection=landsat-c2l2-sr-antarctic-glaciers-thwaites&item={time}&assets=red&assets=green&assets=blue&color_formula=gamma+RGB+2.7%2C+saturation+1.5%2C+sigmoidal+RGB+15+0.55&nodata=0&format=png',
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd'),
          name: 'Landsat L2',
          tileSize: 256,
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-110.26 -73.60,-112.57 -75.18,-106.35 -75.73,-104.61 -74.098,-110.27 -73.60))').toJson(),
            }],
          },
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoiID: 'PineIslandLandsat',
        country: 'all',
        city: 'Antarctica',
        siteName: 'global',
        description: 'Pine Island Landsat L2 low-cloud scenes',
        indicator: 'ADD',
        indicatorName: 'Pine Island Glacier Landsat L2',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        time: availableDates['landsat-c2l2-sr-antarctic-glaciers-pine-island'],
        inputData: [''],
        display: {
          protocol: 'xyz',
          maxZoom: 18,
          minZoom: 7,
          projection: 'EPSG:3857',
          attribution: 'Landsat Data Policy: https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/atoms/files/Landsat_Data_Policy.pdf',
          url: 'https://dev-raster.delta-backend.com/stac/tiles/WebMercatorQuad/{z}/{x}/{y}@2x?collection=landsat-c2l2-sr-antarctic-glaciers-pine-island&item={time}&assets=red&assets=green&assets=blue&color_formula=gamma+RGB+2.7%2C+saturation+1.5%2C+sigmoidal+RGB+15+0.55&nodata=0&format=png',
          dateFormatFunction: (date) => `${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd'),
          name: 'Landsat L2',
          tileSize: 256,
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((-104.723 -73.176,-107.373 -75.653,-97.142-76.195,-96.01 -73.63231719321456,-104.723 -73.1758))').toJson(),
            }],
          },
        },
      },
    },
  },
];

const createSlowDownIndicator = (aoiID, city, country, aoi, geometry, cog, eoSensor, time) => (
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi,
        aoiID,
        country,
        city,
        siteName: city,
        description: 'Slowdown Proxy Maps',
        indicator: 'N7',
        indicatorName: 'Slowdown & Recovery Proxy Maps',
        eoSensor,
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry,
          }],
        },
        time,
        inputData: [''],
        display: {
          protocol: 'xyz',
          url: `https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x?url=s3%3A%2F%2Fcovid-eo-data%2Fslowdown_proxy_map%2F${cog}.tif&resampling_method=bilinear&bidx=1%2C2%2C3`,
          name: 'Movement slowdown',
          tileSize: 256,
          legendUrl: 'legends/trilateral/N7.png',
          disableCompare: true,
          baseLayers: mapBoxHighResoSubst,
        },
      },
    },
  }
);

const slowdownIndicators = [
  {
    aoi: latLng([39.9, 116.38]),
    aoiID: 'CN01',
    country: ['CN'],
    city: 'Beijing',
    eoSensor: ['2020-01-01 compared to 2020-01-29 - 2020-03-01 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((116.07330 39.76632,116.07330 40.21244,116.72973 40.21244,116.72973 39.76632,116.07330 39.76632))').toJson(),
    time: ['2019-11-01'],
    cog: 'Beijing_S1_TA142_SPM_20191101-20200101_20200129-20200301_th-0.cog',
  },
  {
    aoi: latLng([38.90472, -77.01638]),
    aoiID: 'US10',
    country: ['US'],
    city: 'Washington, D.C.',
    eoSensor: ['2020-02-06 compared to 2020-03-28 - 2020-04-24 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-78.1073 38.43207,-78.1073 39.84650,-75.81665 39.84650,-75.81665 38.43207,-78.1073 38.43207))').toJson(),
    time: ['2020-01-03'],
    cog: 'DC_S1_TA004_SPM_20200103-20200206_20200328-20200424_th-0.3.cog',
  },
  {
    aoi: latLng([51.03613, 2.28537]),
    aoiID: 'FR03',
    country: ['FR'],
    city: 'Port of Dunkirk',
    eoSensor: ['2020-02-15 compared to 2020-04-01 - 2020-04-31 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((1.59059 50.73317,1.55490 50.87717,1.73736 50.95414,2.04078 51.01463,2.30437 51.06383,2.50345 51.08280,2.90296 51.24205,3.14734 51.34076,3.60589 51.36905,3.78379 50.85797,2.62231 50.72956,2.57014 50.84064,1.59059 50.73317))').toJson(),
    time: ['2020-01-01'],
    cog: 'Dunkirk_S1_TA161_SPM_20200101-20200215_20200401-20200431_th-0.cog',
  },
  {
    aoi: latLng([51.09155, 3.74008]),
    aoiID: 'BE03',
    country: ['BE'],
    city: 'Port of Ghent',
    eoSensor: ['2020-02-06 compared to 2020-04-01 - 2020-04-30 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((4.19612 51.38292,4.33341 51.41247,4.44187 51.28043,4.63779 50.92072,4.12278 50.84820,3.39652 50.72981,3.22898 51.27339,3.71924 51.35408,3.85245 51.34550,3.90876 51.37295,3.95133 51.41408,4.01999 51.40979,4.05844 51.37552,4.19612 51.38292))').toJson(),
    time: ['2020-01-03'],
    cog: 'Ghent_S1_TA161_SPM_20200103-20200206_20200401-20200430_th-0.cog',
  },
  {
    aoi: latLng([-12.05, -77.03333]),
    aoiID: 'PE01',
    country: ['PE'],
    city: 'Lima',
    eoSensor: ['2020-03-02 compared to 2020-03-26 - 2020-05-01 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-77.17552 -11.72754,-77.00111 -11.66837,-76.88404 -11.66131,-76.80027 -11.62836,-76.68422 -11.63777,-76.68148 -11.72351,-76.52767 -11.82232,-76.52938 -11.95032,-76.53144 -12.16688,-76.42295 -12.38192,-76.43222 -12.42316,-76.70517 -12.57902,-76.81640 -12.51702,-76.80748 -12.39164,-76.93519 -12.29035,-77.07595 -12.1991,-77.23251 -12.15278,-77.29087 -12.07088,-77.28538 -11.74300,-77.17552 -11.72754))').toJson(),
    time: ['2020-01-14'],
    cog: 'Lima_S1_TA018_SPM_20200114-20200302_20200326-20200501_th-0.cog',
  },
  {
    aoi: latLng([34.05, -118.25]),
    aoiID: 'US02A2',
    country: ['US'],
    city: 'Los Angeles - A2',
    eoSensor: ['2020-02-28 compared to 2020-04-01 - 2020-04-30 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-118.76220 33.53217,-118.95172 34.37965,-117.95471 34.54270,-117.94647 34.42497,-116.99615 34.56758,-116.83548 34.00482,-116.76544 33.40390,-118.76220 33.53217))').toJson(),
    time: ['2020-01-01'],
    cog: 'LosAngeles_A2_SPM_10m_20200101-20200228_20200401-20200430_th-0.35.cog',
  },
  {
    aoi: latLng([34.05, -118.25]),
    aoiID: 'US02',
    country: ['US'],
    city: 'Los Angeles',
    eoSensor: ['2020-02-28 compared to 2020-04-01 - 2020-04-30 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-118.76220 33.53217,-118.95172 34.37965,-117.95471 34.54270,-117.94647 34.42497,-116.99615 34.56758,-116.83548 34.00482,-116.76544 33.40390,-118.76220 33.53217))').toJson(),
    time: ['2020-01-03'],
    cog: 'LosAngeles_S1_TA064_SPM_20200103-20200228_20200401-20200430_th-0.cog',
  },
  {
    aoi: latLng([19.076, 72.8777]),
    aoiID: 'IN02',
    country: ['IN'],
    city: 'Mumbai',
    eoSensor: ['2020-01-22 compared to 2020-03-22 - 2020-04-27 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((72.77343 19.45882,73.16894 19.45623,73.91052 19.29299,73.64685 18.58637,72.78991 18.65925,72.67730 18.94006,72.77343 19.45882))').toJson(),
    time: ['2020-01-10'],
    cog: 'Mumbai_S1_TD034_SPM_20200110-20200122_20200322-20200427_th-0.cog',
  },
  {
    aoi: latLng([41.0114, -73.09]),
    aoiID: 'US04',
    country: ['US'],
    city: 'New York',
    eoSensor: ['2020-02-15 compared to 2020-04-01 - 2020-04-31 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-75.14099 40.24599,-75.38269 41.13729,-72.89428 41.69342,-71.5979 40.87614,-75.14099 40.24599))').toJson(),
    time: ['2020-01-01'],
    cog: 'Newyork_S1_TA033_SPM_20200101-20200215_20200401-20200431_th-0.cog',
  },
  {
    aoi: latLng([37.7775, -122.41638]),
    aoiID: 'US03',
    country: ['US'],
    city: 'San Francisco',
    eoSensor: ['2020-02-15 compared to 2020-04-03 - 2020-04-27 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-122.63968 37.09977,-122.63968 38.19095,-120.95375 38.19095,-120.95375 37.09977,-122.63968 37.09977))').toJson(),
    time: ['2020-01-28'],
    cog: 'SanFrancisco_S1_TA035_SPM_20200128-20200215_20200403-20200427_th-0.cog',
  },
  {
    aoi: latLng([-33.45, -70.66666]),
    aoiID: 'CL01',
    country: ['CL'],
    city: 'Santiago',
    eoSensor: ['2020-02-01 compared to 2020-04-01 - 2020-06-12 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-71.29275 -34.15707,-70.54019 -33.91125,-70.48251 -32.91858,-71.60861 -33.02228,-71.52072 -33.49539,-71.29275 -34.15707))').toJson(),
    time: ['2020-01-08'],
    cog: 'Santiago_S1_TA018_SPM_20200108-20200201_20200401-20200612_th-0.cog',
  },
  {
    aoi: latLng([-23.55, -46.63333]),
    aoiID: 'BR02',
    country: ['BR'],
    city: 'Sao Paulo',
    eoSensor: ['2020-02-04 compared to 2020-03-29 - 2020-04-28 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-46.55 -23.45, -46.75 -23.45, -46.75 -23.65, -46.55 -23.65, -46.55 -23.45))').toJson(),
    time: ['2020-01-05'],
    cog: 'SaoPaulo_S1_TD053_SPM_20200105-20200204_20200329-20200428_th-0.cog',
  },
  {
    aoi: latLng([1.26485, 103.84766]),
    aoiID: 'SG01',
    country: ['SG'],
    city: 'Singapore',
    eoSensor: ['2020-02-12 compared to 2020-04-24 - 2020-05-30 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((104.37973 0.99284,102.85125 0.88299,102.84919 1.13563,103.43078 1.35119,103.33122 1.54270,103.14239 1.63193,103.14548 1.68959,103.49773 1.72425,103.98834 1.68959,104.19502 1.76645,104.29355 1.60962,104.31518 1.35634,104.38522 1.01240,104.37973 0.99284))').toJson(),
    time: ['2020-01-07'],
    cog: 'Singapore_S1_TA171_SPM_20200107-20200212_20200424-20200530_th-0.cog',
  },
  {
    aoi: latLng([35, 137]),
    aoiID: 'JP01',
    country: ['JP'],
    city: 'Aichi',
    eoSensor: ['2020-01-09 compared to 2020-04-26 - 2020-05-08 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((135.864 34.257,138.0622 34.257,138.0622 35.771,135.864 35.771,135.864 34.257))').toJson(),
    time: ['2020-01-09'],
    cog: 'Aichi_S1_TA112_SPM_20200109-20200214_20200426-20200508_th-0.35.cog',
  },
  {
    aoi: latLng([-22.875, -43.3305]),
    aoiID: 'BR03',
    country: ['BR'],
    city: 'Rio de Janeiro',
    eoSensor: ['2020-01-12 compared to 2020-03-24 - 2020-04-29 - Derived from Sentinel-1'],
    geometry: wkt.read('POLYGON((-44.292 -23.472,-42.369 -23.472,-42.369 -22.278,-44.292 -22.278,-44.292 -23.472))').toJson(),
    time: ['2020-01-12'],
    cog: 'RiodeJaneiro_S1_TD155_SPM_20200112-20200217_20200324-20200429_th-0.3.cog',
  },
];

slowdownIndicators.forEach((ind) => (
  globalIndicators.push(createSlowDownIndicator(
    ind.aoiID, ind.city, ind.country, ind.aoi,
    ind.geometry, ind.cog, ind.eoSensor, ind.time,
  ))
));

const createSTACCollectionIndicator = (collection, key, value, url,
  indicator, description, legendUrl) => {
  const bbox = JSON.parse(key);
  const aoi = latLng([
    bbox[1] + (bbox[3] - bbox[1]) / 2,
    bbox[0] + (bbox[2] - bbox[0]) / 2,
  ]);
  const geometry = {
    coordinates: [[
      [bbox[0], bbox[1]],
      [bbox[2], bbox[1]],
      [bbox[2], bbox[3]],
      [bbox[0], bbox[3]],
      [bbox[0], bbox[1]],
    ]],
    type: 'Polygon',
  };
  const indicatorObject = {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        aoi,
        id: value.id,
        aoiID: value.id,
        country: [value.country],
        city: value.location,
        siteName: value.location,
        description,
        indicator,
        indicatorName: '',
        subAoi: {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry,
          }],
        },
        time: availableDates[`${collection}-${value.id}`],
        inputData: [''],
        display: {
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 5,
          url,
          name: description,
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy-MM-dd'),
          legendUrl,
        },
      },
    },
  };
  return indicatorObject;
};
const urlMapping = {
  'nightlights-hd-monthly': 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0,255&bidx=1&colormap_name=inferno',
  'nightlights-hd-1band': 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0,255&bidx=1&colormap_name=inferno',
  'blue-tarp-planetscope': 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}',
  'blue-tarp-detection': 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0,10000&bidx=1&colormap_name=inferno',
};

Object.keys(locations).forEach((collection) => {
  Object.entries(locations[collection].entries).forEach(([key, value]) => {
    globalIndicators.push(createSTACCollectionIndicator(
      collection, key, value, urlMapping[collection],
      locations[collection].indicator, locations[collection].description,
      locations[collection].legendUrl,
    ));
  });
});
