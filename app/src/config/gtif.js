import { Wkt } from 'wicket';
import { shTimeFunction } from '@/utils';
import { baseLayers, overlayLayers } from '@/config/layers';
import { DateTime } from 'luxon';
import { latLng, latLngBounds } from 'leaflet';
import colormap from 'colormap';
import availableDates from '@/config/data_dates.json';

import {
  statisticalApiHeaders,
  statisticalApiBody,
  evalScriptsDefinitions,
  parseStatAPIResponse,
  nasaTimelapseConfig,
} from '@/helpers/customAreaObjects';

// Helper function to create colorscales for cog style rendering
function getColorStops(name, min, max, steps, reverse) {
  const delta = (max - min) / (steps - 1);
  const stops = new Array(steps * 2);
  const colors = colormap({
    colormap: name, nshades: steps, format: 'rgba',
  });
  if (reverse) {
    colors.reverse();
  }
  for (let i = 0; i < steps; i++) {
    stops[i * 2] = min + i * delta;
    stops[i * 2 + 1] = colors[i];
  }
  return stops;
}

const wkt = new Wkt();

export const dataPath = './data/gtif/data/';
export const dataEndpoints = [
  {
    type: 'eox',
    provider: './data/gtif/pois_gtif.json',
  },
];

export const layerNameMapping = Object.freeze({});

export const indicatorClassesIcons = Object.freeze({
  agriculture: 'mdi-barley',
  water: 'mdi-water',
  land: 'mdi-image-filter-hdr',
  health: 'mdi-hospital-box-outline',
  combined: 'mdi-set-center',
  air: 'mdi-weather-windy',
  economic: 'mdi-currency-eur',
});

export const mapDefaults = Object.freeze({
  bounds: latLngBounds(latLng([46, 9]), latLng([49.5, 18])),
});

export const baseLayersLeftMap = [{
  ...baseLayers.terrainLight, visible: true,
}, baseLayers.cloudless, baseLayers.S2GLC];
export const baseLayersRightMap = [{
  ...baseLayers.terrainLight, visible: true,
}, baseLayers.cloudless];

export const overlayLayersLeftMap = [{
  ...overlayLayers.eoxOverlay, visible: true,
}];
export const overlayLayersRightMap = [{
  ...overlayLayers.eoxOverlay, visible: true,
}];

const nutsStyle = {
  attribution: 'Administrative boundaries: © EuroGeographics, © TurkStat. Source: European Commission – Eurostat/GISCO',
  visible: true,
  protocol: 'GeoJSON',
  style: {
    fillColor: 'rgba(0, 0, 0, 0)',
    color: '#006762',
  },
};

export const administrativeLayers = [{
  ...nutsStyle,
  name: 'NUTS L0',
  url: 'data/gtif/data/AT_NUTS_L0.geojson',
  maxZoom: 7.5,
}, {
  ...nutsStyle,
  name: 'NUTS L1',
  url: 'data/gtif/data/AT_NUTS_L1.geojson',
  minZoom: 7.5,
  maxZoom: 8.5,
}, {
  ...nutsStyle,
  name: 'NUTS L2',
  url: 'data/gtif/data/AT_NUTS_L2.geojson',
  minZoom: 8.5,
  maxZoom: 9.5,
}, {
  ...nutsStyle,
  name: 'NUTS L3',
  url: 'data/gtif/data/AT_NUTS_L3.geojson',
  minZoom: 9.5,
  maxZoom: 10.5,
}, {
  ...nutsStyle,
  protocol: 'flatgeobuf',
  name: 'District (Bezirk)',
  url: '//eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/admin_borders/STATISTIK_AUSTRIA_POLBEZ_20220101.fgb',
  minZoom: 10.5,
  maxZoom: 12,
  attribution: 'Data source: Statistics Austria — data.statistik.gv.at',
}, {
  ...nutsStyle,
  protocol: 'flatgeobuf',
  name: 'Municipality (Gemeinde)',
  url: '//eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/admin_borders/STATISTIK_AUSTRIA_GEM_20220101.fgb',
  minZoom: 12,
  maxZoom: 13.5,
  attribution: 'Data source: Statistics Austria — data.statistik.gv.at',
}, {
  ...nutsStyle,
  protocol: 'flatgeobuf',
  name: 'Census Track (Zählsprengel)',
  url: '//eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/admin_borders/STATISTIK_AUSTRIA_ZSP_20220101.fgb',
  minZoom: 13.5,
  attribution: 'Data source: Statistics Austria — data.statistik.gv.at',
}];

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

export const indicatorsDefinition = Object.freeze({
  BM1: {
    indicator: 'Biomass',
    class: 'air',
    themes: ['carbon-accounting'],
  },
  REP1: {
    indicator: 'Wind Energy',
    class: 'air',
    themes: ['energy-transition'],
    // story: '',
  },
  REP2: {
    indicator: 'Solar Energy',
    class: 'air',
    themes: ['energy-transition'],
    // story: '',
  },
  REP3: {
    indicator: 'Nowcasting',
    class: 'air',
    themes: ['energy-transition'],
    // story: '',
  },
  REP4: {
    indicator: 'Hydro Power',
    class: 'air',
    themes: ['energy-transition'],
    // story: '',
  },
  REP5: {
    indicator: 'Micro Hydropower',
    class: 'air',
    themes: ['energy-transition'],
    // story: '',
  },
  SOL1: {
    indicator: 'sus cities',
    class: 'air',
    themes: ['sustainable-cities'],
  },
  SOL2: {
    indicator: 'sus cities',
    class: 'air',
    themes: ['sustainable-cities'],
  },
  SOL3: {
    indicator: 'urban trees',
    class: 'air',
    themes: ['sustainable-cities'],
  },
  LST: {
    indicator: 'Low surface temperature',
    class: 'air',
    themes: ['carbon-accounting'],
  },
  AQ: {
    indicator: 'Air Quality',
    class: 'air',
    themes: ['mobility-transition'],
  },
  WSF: {
    indicator: 'World Settlement Footprint',
    class: 'economic',
    story: '/eodash-data/stories/WSF-WSF',
    themes: ['atmosphere'],
  },
  N1: {
    indicator: 'Air quality',
    class: 'air',
    story: '/eodash-data/stories/N1',
    externalData: {
      label: 'Sentinel-5p Mapping Service',
      url: 'https://maps.s5p-pal.com',
    },
    largeTimeDuration: true,
    themes: ['atmosphere'],
  },
  N9: {
    indicator: 'Air quality',
    class: 'air',
    hideInFilters: true,
    story: '/eodash-data/stories/N9',
    themes: ['atmosphere'],
  },
  N10: {
    indicator: 'Air quality',
    class: 'air',
    hideInFilters: true,
    story: '/eodash-data/stories/N10',
    themes: ['atmosphere'],
  },
  GG: {
    indicator: 'Mobility',
    class: 'economic',
    disableTimeSelection: true,
    story: '/eodash-data/stories/GG-GG',
    themes: ['economy', 'atmosphere'],
    disableCSV: true,
    alternateDataPath: './eodash-data/internal/',
  },
});

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

export const globalIndicators = [
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Air quality',
        indicator: 'AQ',
        lastIndicatorValue: null,
        indicatorName: 'Air quality',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'AT',
        time: [
          '2022-04-28',
          '2022-04-29',
          '2022-04-30',
          '2022-05-01',
          '2022-05-02',
          '2022-05-03',
          '2022-05-04',
          '2022-05-05',
          '2022-05-06',
          '2022-05-07',
          '2022-05-08',
          '2022-05-09',
          '2022-05-11',
          '2022-05-12',
          '2022-05-13',
          '2022-05-14',
          '2022-05-15',
          '2022-05-16',
          '2022-05-17',
          '2022-05-18',
          '2022-05-19',
          '2022-05-20',
          '2022-05-21',
          '2022-05-22',
          '2022-05-23',
          '2022-05-24',
          '2022-05-25',
          '2022-05-26',
          '2022-05-27',
          '2022-05-28',
          '2022-05-29',
          '2022-05-30',
          '2022-05-31',
          '2022-06-01',
          '2022-06-02',
          '2022-06-03',
          '2022-06-04',
          '2022-06-05',
          '2022-06-06',
          '2022-06-07',
          '2022-06-08',
          '2022-06-09',
          '2022-06-10',
          '2022-06-11',
          '2022-06-12',
          '2022-06-13',
          '2022-06-14',
          '2022-06-15',
          '2022-06-16',
          '2022-06-17',
          '2022-06-18',
          '2022-06-19',
          '2022-06-20',
          '2022-06-21',
          '2022-06-22',
          '2022-06-23',
          '2022-06-24',
          '2022-06-25',
          '2022-06-26',
          '2022-06-27',
          '2022-06-28',
          '2022-06-29',
          '2022-07-01',
          '2022-07-02',
          '2022-07-03',
          '2022-07-04',
          '2022-07-05',
          '2022-07-06',
          '2022-07-07',
          '2022-07-08',
          '2022-07-09',
          '2022-07-10',
          '2022-07-11',
          '2022-07-12',
          '2022-07-13',
          '2022-07-14',
          '2022-07-15',
          '2022-07-18',
          '2022-07-19',
          '2022-07-20',
          '2022-07-21',
          '2022-07-22',
          '2022-07-23',
          '2022-07-24',
          '2022-07-25',
          '2022-07-26',
          '2022-07-27',
          '2022-07-29',
          '2022-07-30',
          '2022-07-31',
          '2022-08-01',
          '2022-08-02',
          '2022-08-03',
          '2022-08-04',
          '2022-08-05',
          '2022-08-06',
          '2022-08-07',
          '2022-08-08',
          '2022-08-09',
          '2022-08-10',
          '2022-08-11',
          '2022-08-12',
          '2022-08-13',
          '2022-08-14',
          '2022-08-15',
          '2022-08-16',
          '2022-08-17',
          '2022-08-18',
          '2022-08-19',
          '2022-08-20',
          '2022-08-21',
          '2022-08-22',
          '2022-08-23',
          '2022-08-24',
          '2022-08-25',
          '2022-08-26',
          '2022-08-27',
          '2022-08-28',
          '2022-09-07',
          '2022-09-08',
          '2022-09-09',
          '2022-09-10',
          '2022-09-11',
          '2022-09-12',
          '2022-09-13',
          '2022-09-14',
          '2022-09-15',
          '2022-09-17',
          '2022-09-18',
          '2022-09-19',
          '2022-09-20',
          '2022-09-21',
          '2022-09-22',
          '2022-09-23',
          '2022-09-24',
          '2022-09-25',
          '2022-10-05',
          '2022-10-06',
          '2022-10-07',
          '2022-10-10',
          '2022-10-11',
          '2022-10-12',
        ],
        inputData: [''],
        yAxis: '',
        vectorStyles: {
          sourceLayer: 'air_quality_AT',
          items: [
            {
              id: 'NO2',
              description: 'Nitrogen Dioxide',
              markdown: 'AQ_NO2',
            },
            {
              id: 'PM10',
              description: 'Particulate Matter < 10µm',
              markdown: 'AQ_PM10',
            },
            {
              id: 'PM25',
              description: 'Particulate Matter < 2.5µm',
              markdown: 'AQ_PM25',
            },
          ],
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          protocol: 'vectorgeojson',
          selectedStyleLayer: 'NO2',
          styleFile: 'data/gtif/data/air_quality_at.json',
          id: 'air_quality_AT',
          name: 'air_quality_at',
          minZoom: 1,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy_MM_dd'),
          labelFormatFunction: (date) => date,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Innsbruck',
        siteName: 'global',
        description: 'Green Roofs - Innsbruck',
        indicator: 'SOL1',
        lastIndicatorValue: null,
        indicatorName: 'Green Roofs - Innsbruck',
        navigationDescription: 'Green Roof Impact',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Innsbruck',
        time: [],
        inputData: [''],
        yAxis: '',
        vectorStyles: {
          sourceLayer: 'green_roofs_innsbruck',
          items: [
            {
              id: 'GRImpScore_filtered',
              description: 'Green Roof Impact Score',
              markdown: 'SOL1_GRImpact',
            },
            {
              id: 'LST2021',
              description: 'Max Land Surface Temperature',
              markdown: '',
            },
            {
              id: 'GRExisting',
              description: 'Existing Green Roofs',
              markdown: 'SOL1_GRExisting',
            },
            {
              id: 'GRPotential',
              description: 'Roofs Suitable for Greening',
              markdown: '',
            },
            {
              id: 'GRPotPAr20',
              description: 'Percentage GR-Potential Area in relation to Total Roof Area',
              markdown: '',
            },
          ],
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((11.2 47.2, 11.2 47.3, 11.6 47.3, 11.6 47.2, 11.2 47.2 ))').toJson(),
            }],
          },
          protocol: 'vectortile',
          styleFile: 'data/gtif/data/green_rooftops_innsbruck.json',
          selectedStyleLayer: 'GRImpScore_filtered',
          id: 'green_roofs_innsbruck',
          name: '',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Innsbruck',
        siteName: 'global',
        description: 'Solar Roofs - Innsbruck',
        indicator: 'SOL2',
        lastIndicatorValue: null,
        indicatorName: 'Solar Roofs - Innsbruck',
        navigationDescription: 'Electrical Power Production potential',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Innsbruck',
        time: [],
        inputData: [''],
        yAxis: '',
        vectorStyles: {
          sourceLayer: 'solar_roofs_innsbruck',
          items: [
            {
              id: 'PVEPPMwhHP',
              description: 'Total electric power production potential - High Performance ',
              markdown: 'SOL1_TEP_HP',
            },
            {
              id: 'PVExisting',
              description: 'Existing PV Panels',
              markdown: 'SOL1_PVExisting',
            },
            {
              id: 'PVEPPMwhRP',
              description: 'Total electric power production potential - Regular performance',
              markdown: 'SOL1_TEP_RP',
            },
            {
              id: 'PVEPPMwhLP',
              description: 'Total electric power production potential - Low performance',
              markdown: 'SOL1_TEP_LP',
            },
          ],
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((11.2 47.2, 11.2 47.3, 11.6 47.3, 11.6 47.2, 11.2 47.2 ))').toJson(),
            }],
          },
          protocol: 'vectortile',
          styleFile: 'data/gtif/data/solar_roofs_innsbruck.json',
          selectedStyleLayer: 'PVEPPMwhHP',
          id: 'solar_roofs_innsbruck',
          name: '',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Innsbruck',
        siteName: 'global',
        description: 'Urban Trees - Innsbruck',
        indicator: 'SOL3',
        lastIndicatorValue: null,
        indicatorName: 'Urban Trees - Innsbruck',
        navigationDescription: 'Urban Tree Impact',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Innsbruck',
        time: [],
        inputData: [''],
        yAxis: '',
        vectorStyles: {
          sourceLayer: 'urban_trees_innsbruck',
          items: [
            {
              id: 'GRImpScore_filtered',
              description: 'Existing PV Panels',
              markdown: 'SOL1_PVExisting',
            },
            {
              id: 'GRExisting',
              description: 'Existing green roofs',
              markdown: 'SOL1_GRExisting',
            },
            {
              id: 'PVEPPMwhHP',
              description: 'Total electric power production potential - High performance',
              markdown: 'SOL1_TEP_HP',
            },
            {
              id: 'PVEPPMwhRP',
              description: 'Total electric power production potential - Regular performance',
              markdown: 'SOL1_TEP_RP',
            },
            {
              id: 'PVEPPMwhLP',
              description: 'Total electric power production potential - Low performance',
              markdown: 'SOL1_TEP_LP',
            },
            {
              id: 'GRImpScore',
              description: 'Green roof impact score',
              markdown: 'SOL1_GRImpact',
            },
          ],
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((11.2 47.2, 11.2 47.3, 11.6 47.3, 11.6 47.2, 11.2 47.2 ))').toJson(),
            }],
          },
          protocol: 'vectortile',
          styleFile: 'data/gtif/data/solar_roofs_innsbruck.json',
          selectedStyleLayer: 'PVExisting',
          id: 'urban_trees_innsbruck',
          name: '',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Biomass',
        navigationDescription: 'Placeholder for description text',
        indicator: 'BM1',
        lastIndicatorValue: null,
        indicatorName: 'Biomass',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          protocol: 'cog',
          id: 'BM1',
          sources: [
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/Carbon_accounting/3857/Austria_AutoChange2020-2021-packed-rendered_3857.tif' },
          ],
          normalize: true,
          style: {
          },
          name: 'biomass',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Site Suitability Assessment & Trade-off Explorer',
        navigationDescription: 'Site Suitability Assessment & Trade-off Explorer',
        indicator: 'REP1',
        lastIndicatorValue: null,
        indicatorName: 'Wind Energy',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        cogFilters: {
          sourceLayer: 'REP1',
          filters: {
            elevation: {
              label: 'Filter for elevation [m]',
              id: 'elevation',
              min: 0,
              max: 4000,
              range: [0, 4000],
            },
            slope: {
              label: 'Filter for slope [°]',
              id: 'slope',
              min: 0,
              max: 50,
              range: [0, 50],
            },
            settlementDistance: {
              label: 'Distance to settlements [m]',
              id: 'settlementDistance',
              min: 0,
              max: 3000,
              range: [0, 3000],
            },
            energyGridDistance: {
              label: 'Distance to energy grid [m]',
              id: 'energyGridDistance',
              min: 0,
              max: 25000,
              range: [0, 25000],
            },
          },
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          protocol: 'cog',
          id: 'REP1',
          sources: [
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/PowerDensity_Austria_COG_3857_clipped_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/Copernicus_DSM_COG_10m_3857_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/Copernicus_10m_DSM_COG_Slope_3857_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/WSF_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/PowerLineHigh_EucDist_Austria_3857_COG_fix.tif' },
          ],
          style: {
            variables: {
              elevationMin: 0,
              elevationMax: 4000,
              slopeMin: 0,
              slopeMax: 50,
              settlementDistanceMin: 0,
              settlementDistanceMax: 3000,
              energyGridDistanceMin: 0,
              energyGridDistanceMax: 25000,
            },
            color: [
              'case',
              [
                'all',
                ['>', ['band', 1], 0],
                ['between', ['band', 2], ['var', 'elevationMin'], ['var', 'elevationMax']],
                ['between', ['band', 3], ['var', 'slopeMin'], ['var', 'slopeMax']],
                ['between', ['band', 4], ['var', 'settlementDistanceMin'], ['var', 'settlementDistanceMax']],
                ['between', ['band', 5], ['var', 'energyGridDistanceMin'], ['var', 'energyGridDistanceMax']],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('RdBu', 80, 850, 100, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Wind Energy',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Site Suitability Assessment & Trade-off Explorer',
        navigationDescription: 'Site Suitability Assessment & Trade-off Explorer',
        indicator: 'REP2',
        lastIndicatorValue: null,
        indicatorName: 'Solar Energy',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        cogFilters: {
          sourceLayer: 'REP2',
          filters: {
            aspect: {
              label: 'Filter for aspect',
              id: 'aspect',
              min: 0,
              max: 360,
              range: [0, 360],
            },
            slope: {
              label: 'Filter for slope',
              id: 'slope',
              min: 0,
              max: 50,
              range: [0, 50],
            },
            energyGridDistance: {
              label: 'Distance to energy grid',
              id: 'energyGridDistance',
              min: 0,
              max: 50000,
              range: [0, 50000],
            },
            elevation: {
              label: 'Filter for elevation [m]',
              id: 'elevation',
              min: 0,
              max: 4000,
              range: [0, 4000],
            },
          },
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          protocol: 'cog',
          id: 'REP2',
          sources: [
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/GHI_Austria_COG_3857_clipped_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/Copernicus_10m_DSM_COG_Aspect_3857_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/Copernicus_10m_DSM_COG_Slope_3857_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/PowerLineHigh_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/Copernicus_DSM_COG_10m_3857_fix.tif' },
          ],
          style: {
            variables: {
              aspectMin: 0,
              aspectMax: 360,
              slopeMin: 0,
              slopeMax: 50,
              energyGridDistanceMin: 0,
              energyGridDistanceMax: 50000,
              elevationMin: 0,
              elevationMax: 4000,
            },
            color: [
              'case',
              [
                'all',
                ['>', ['band', 1], 0],
                ['between', ['band', 2], ['var', 'aspectMin'], ['var', 'aspectMax']],
                ['between', ['band', 3], ['var', 'slopeMin'], ['var', 'slopeMax']],
                ['between', ['band', 4], ['var', 'energyGridDistanceMin'], ['var', 'energyGridDistanceMax']],
                ['between', ['band', 5], ['var', 'elevationMin'], ['var', 'elevationMax']],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('viridis', 900, 1400, 10, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Solar Energy',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        indicator: 'REP3',
        description: 'NRT Energy Production Forecast',
        navigationDescription: 'NRT Energy Production Forecast',
        lastIndicatorValue: null,
        indicatorName: 'Nowcasting',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        cogFilters: {
        },
        display: {
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        indicator: 'REP4',
        description: 'Dynamic Storage Capacity',
        navigationDescription: 'Dynamic Storage Capacity',
        lastIndicatorValue: null,
        indicatorName: 'Hydro Power',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        cogFilters: {
          sourceLayer: 'REP4',
          filters: {
            rugedeness: {
              label: 'Filter for rugedeness index',
              id: 'rugedeness',
              min: 0,
              max: 0.78,
            },
            settlementDistance: {
              label: 'Distance to settlements',
              id: 'settlementDistance',
              min: 0,
              max: 5670,
            },
            energyGridDistance: {
              label: 'Distance to energy grid',
              id: 'energyGridDistance',
              min: 0,
              max: 50000,
            },
            slope: {
              label: 'Filter for slope',
              id: 'slope',
              min: 0,
              max: 50,
            },
            aspect: {
              label: 'Filter for aspect',
              id: 'aspect',
              min: 0,
              max: 360,
            },
            altitude: {
              label: 'Filter for altitude',
              id: 'altitude',
              min: 0,
              max: 2000,
            },
          },
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          protocol: 'cog',
          id: 'REP4',
          sources: [
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/PowerDensity_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/RuggednessIndex_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/WSF_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/PowerLineHigh_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/Copernicus_10m_DSM_COG_Slope_3857_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/Copernicus_10m_DSM_COG_Aspect_3857_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/ESA_WorldCover_10m_COG_3857_fix.tif' },
          ],
          style: {
            variables: {
              rugedenessMin: 0,
              rugedenessMax: 0.78,
              settlementDistanceMin: 0,
              settlementDistanceMax: 5670,
              energyGridDistanceMin: 0,
              energyGridDistanceMax: 50000,
              slopeMin: 0,
              slopeMax: 50,
              aspectMin: 0,
              aspectMax: 360,
            },
            color: [
              'case',
              [
                'all',
                ['between', ['band', 2], ['var', 'rugedenessMin'], ['var', 'rugedenessMax']],
                ['between', ['band', 3], ['var', 'settlementDistanceMin'], ['var', 'settlementDistanceMax']],
                ['between', ['band', 4], ['var', 'energyGridDistanceMin'], ['var', 'energyGridDistanceMax']],
                ['between', ['band', 5], ['var', 'slopeMin'], ['var', 'slopeMax']],
                ['between', ['band', 6], ['var', 'aspectMin'], ['var', 'aspectMax']],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('viridis', 0, 9000, 10, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Hydro Power',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Potential Assessment',
        navigationDescription: 'Potential Assessment',
        indicator: 'REP5',
        lastIndicatorValue: null,
        indicatorName: 'Micro Hydropower',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'Austria',
        time: [],
        inputData: [''],
        yAxis: '',
        cogFilters: {
          sourceLayer: 'REP5',
          filters: {
            rugedeness: {
              label: 'Filter for rugedeness index',
              id: 'rugedeness',
              min: 0,
              max: 0.78,
            },
            settlementDistance: {
              label: 'Distance to settlements',
              id: 'settlementDistance',
              min: 0,
              max: 5670,
            },
            energyGridDistance: {
              label: 'Distance to energy grid',
              id: 'energyGridDistance',
              min: 0,
              max: 50000,
            },
            slope: {
              label: 'Filter for slope',
              id: 'slope',
              min: 0,
              max: 50,
            },
            aspect: {
              label: 'Filter for aspect',
              id: 'aspect',
              min: 0,
              max: 360,
            },
            altitude: {
              label: 'Filter for altitude',
              id: 'altitude',
              min: 0,
              max: 2000,
            },
          },
        },
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          protocol: 'cog',
          id: 'REP5',
          sources: [
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/PowerDensity_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/RuggednessIndex_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/WSF_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/PowerLineHigh_EucDist_Austria_3857_COG_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/Copernicus_10m_DSM_COG_Slope_3857_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/Copernicus_10m_DSM_COG_Aspect_3857_fix.tif' },
            { url: 'https://eox-gtif-a.s3.eu-central-1.amazonaws.com/GTIF/DHI_reprojected_2/ESA_WorldCover_10m_COG_3857_fix.tif' },
          ],
          style: {
            variables: {
              rugedenessMin: 0,
              rugedenessMax: 0.78,
              settlementDistanceMin: 0,
              settlementDistanceMax: 5670,
              energyGridDistanceMin: 0,
              energyGridDistanceMax: 50000,
              slopeMin: 0,
              slopeMax: 50,
              aspectMin: 0,
              aspectMax: 360,
            },
            color: [
              'case',
              [
                'all',
                ['between', ['band', 2], ['var', 'rugedenessMin'], ['var', 'rugedenessMax']],
                ['between', ['band', 3], ['var', 'settlementDistanceMin'], ['var', 'settlementDistanceMax']],
                ['between', ['band', 4], ['var', 'energyGridDistanceMin'], ['var', 'energyGridDistanceMax']],
                ['between', ['band', 5], ['var', 'slopeMin'], ['var', 'slopeMax']],
                ['between', ['band', 6], ['var', 'aspectMin'], ['var', 'aspectMax']],
              ],
              [
                'interpolate',
                ['linear'],
                ['band', 1],
                ...getColorStops('viridis', 0, 9000, 10, false),
              ],
              [
                'color', 0, 0, 0, 0,
              ],
            ],
          },
          name: 'Micro-Hydropower',
          minZoom: 1,
        },
      },
    },
  },
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'Austria',
        siteName: 'global',
        description: 'Low surface temperature',
        indicator: 'LST',
        lastIndicatorValue: null,
        indicatorName: 'Low surface temperature',
        eoSensor: '',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'LST',
        time: [''],
        inputData: [''],
        yAxis: '',
        display: {
          presetView: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: wkt.read('POLYGON((9.5 46, 9.5 49, 17.1 49, 17.1 46, 9.5 46))').toJson(),
            }],
          },
          protocol: 'xyz',
          minZoom: 1,
          maxNativeZoom: 6,
          tileSize: 256,
          opacity: 1,
          url: 'https://tileserver.geoville.com/heatMap/LST_aggregated_reproc_filt_clipped_AT_buffered/%7Bz%7D/%7Bx%7D/%7By%7D.png/LST_aggregated_reproc_filt_clipped_AT_buffered/{z}/{x}/{y}.png',
          name: 'Low surface temperature',
          // legendUrl: 'data/trilateral/no2Legend-monthly-nasa.png',
        },
      },
    },
  },
  /*
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
          legendUrl: 'eodash-data/data/wsf_legend.png',
          minZoom: 1,
          maxMapZoom: 14,
          dateFormatFunction: (date) => DateTime.fromISO(date).toFormat('yyyy'),
          labelFormatFunction: (date) => date,
          specialEnvTime: true,
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
          legendUrl: 'eodash-data/data/no2Legend.png',
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
        description: 'Methane (Weekly)',
        indicator: 'N1',
        lastIndicatorValue: null,
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
        lastColorCode: null,
        aoi: null,
        aoiID: 'CH4',
        time: availableDates.AWS_CH4_WEEKLY,
        inputData: [''],
        yAxis: 'Tropospheric CH4 volume mixing ratio (ppbv)',
        display: {
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          opacity: 1.0,
          customAreaIndicator: true,
          name: 'Air Quality (CH4) - ESA',
          layers: 'AWS_CH4_WEEKLY',
          minZoom: 1,
          legendUrl: 'eodash-data/data/ch4_legend_mixing_ratio.png',
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
  */
  /*
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Nitrogen Dioxide (Monthly)',
        indicator: 'N1',
        lastIndicatorValue: null,
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
        lastColorCode: null,
        aoi: null,
        aoiID: 'W2',
        time: availableDates['no2-monthly'],
        inputData: [''],
        yAxis: 'NO2 [µmol/m²]',
        display: {
          customAreaIndicator: true,
          protocol: 'xyz',
          minZoom: 1,
          maxNativeZoom: 6,
          tileSize: 256,
          opacity: 1,
          url: 'https://8ib71h0627.execute-api.us-east-1.amazonaws.com/v1/{z}/{x}/{y}@1x.png?url=s3://covid-eo-data/OMNO2d_HRM/OMI_trno2_monthly_0.10x0.10_{time}_Col3_V4.nc.tif&resampling_method=bilinear&bidx=1&rescale=0%2C108e14&color_map=reds',
          name: 'Air Quality (NASA)',
          dateFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyyMM'),
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('LLL yyyy'),
          legendUrl: 'data/trilateral/no2Legend-monthly-nasa.png',
          areaIndicator: nasaTimelapseConfig('no2'),
        },
      },
    },
  },
  */
  /*
  {
    properties: {
      indicatorObject: {
        dataLoadFinished: true,
        country: 'all',
        city: 'World',
        siteName: 'global',
        description: 'Nitrogen Dioxide (Yearly)',
        indicator: 'N9',
        lastIndicatorValue: null,
        indicatorName: 'Nitrogen Dioxide (Yearly)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'W8',
        time: availableDates['OMI_trno2-COG'],
        inputData: [''],
        display: {
          // mosaicIndicator: true,
          // collection: 'OMI_trno2-COG',
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          minMapZoom: 1,
          maxZoom: 10,
          maxMapZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=-1e14,37e14&bidx=1&colormap_name=reds',
          name: 'NO2 OMI Annual',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'data/trilateral/no2Legend-yearly-nasa.png',
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
        description: 'Nitrogen Dioxide (Weekly/Monthly)',
        indicator: 'N1',
        lastIndicatorValue: null,
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
        lastColorCode: null,
        aoi: null,
        aoiID: 'W1',
        time: availableDates['AWS_NO2-VISUALISATION'],
        inputData: [''],
        yAxis: 'Tropospheric NO2 (μmol/m2)',
        display: {
          customAreaIndicator: true,
          baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceId}`,
          name: 'Air Quality (NO2) - ESA',
          layers: 'AWS_NO2-VISUALISATION',
          legendUrl: 'eodash-data/data/no2Legend.png',
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
        description: 'Sulfur Dioxide (OMI/Aura)',
        indicator: 'N10',
        lastIndicatorValue: null,
        indicatorName: 'Sulfur Dioxide (OMI/Aura)',
        subAoi: {
          type: 'FeatureCollection',
          features: [],
        },
        lastColorCode: null,
        aoi: null,
        aoiID: 'W9',
        time: availableDates['OMSO2PCA-COG'],
        inputData: [''],
        display: {
          // mosaicIndicator: true,
          // collection: 'OMSO2PCA-COG',
          protocol: 'xyz',
          tileSize: 256,
          minZoom: 1,
          minMapZoom: 1,
          maxZoom: 10,
          maxMapZoom: 10,
          url: 'https://staging-raster.delta-backend.com/cog/tiles/WebMercatorQuad/{z}/{x}/{y}?{time}&resampling_method=bilinear&rescale=0.0,1.0&bidx=1&colormap_name=viridis',
          name: 'SO2 OMI/Aura',
          dateFormatFunction: (date) => `url=${date[1]}`,
          labelFormatFunction: (date) => DateTime.fromISO(date[0]).toFormat('yyyy'),
          legendUrl: 'data/trilateral/SO2OMI-Aura-legend.png',
        },
      },
    },
  },
  */
  /*
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
        lastIndicatorValue: null,
        indicatorName: 'Sulfur Dioxide (TROPOMI)',
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
          legendUrl: 'eodash-data/data/colorbarso2.svg',
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
  */
];
