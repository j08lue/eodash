// eslint-disable-next-line import/no-named-default
import { default as powerOpenInsfrastructureStyle } from '@/assets/openinframap/style_oim_power';

export const baseLayers = Object.freeze({
  cloudless: {
    name: 'EOxCloudless 2021',
    url: '//s2maps-tiles.eu/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ EOxCloudless 2021: <a xmlns:dct="http://purl.org/dc/terms/" href="//s2maps.eu" target="_blank" property="dct:title">Sentinel-2 cloudless - s2maps.eu</a> by <a xmlns:cc="http://creativecommons.org/ns#" href="//eox.at" target="_blank" property="cc:attributionName" rel="cc:attributionURL">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2021) }',
    visible: false,
    maxZoom: 17,
    protocol: 'xyz',
  },
  terrainLight: {
    name: 'Terrain light',
    url: '//s2maps-tiles.eu/wmts/1.0.0/terrain-light_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ Terrain light: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors and <a href="//maps.eox.at/#data" target="_blank">others</a>, Rendering &copy; <a href="http://eox.at" target="_blank">EOX</a> }',
    maxZoom: 16,
    visible: false,
    protocol: 'xyz',
  },
  eoxosm: {
    name: 'OSM Background',
    url: '//s2maps-tiles.eu/wmts/1.0.0/osm_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ OSM: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors and <a href="//maps.eox.at/#data" target="_blank">others</a>, Rendering &copy; <a href="http://eox.at" target="_blank">EOX</a> }',
    maxZoom: 16,
    visible: false,
    protocol: 'xyz',
  },
  S2GLC: {
    baseUrl: `https://shservices.mundiwebservices.com/ogc/wms/${shConfig.shInstanceIdGtif}`,
    protocol: 'WMS',
    format: 'image/png',
    tileSize: 512,
    name: 'S2GLC - Europe Land Cover 2017',
    layers: 'S2GLC_2017',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    visible: false,
    minZoom: 7,
  },
  geolandbasemap: {
    name: 'Geoland Basemap',
    url: '//maps1.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png',
    attribution: '{ Datenquelle: <a href="https://basemap.at" target="_blank" property="dct:title">basemap.at</a> }',
    visible: false,
    maxZoom: 18,
    protocol: 'xyz',
  },
  bmapgelaende: {
    name: 'Geoland Basemap Gelände',
    url: '//maps1.wien.gv.at/basemap/bmapgelaende/grau/google3857/{z}/{y}/{x}.jpeg',
    attribution: '{ Datenquelle: <a href="https://basemap.at" target="_blank" property="dct:title">basemap.at</a> }',
    visible: false,
    maxZoom: 18,
    protocol: 'xyz',
  },
  bmaporthofoto30cm: {
    name: 'Geoland Basemap Orthofoto',
    url: '//maps1.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg',
    attribution: '{ Datenquelle: <a href="https://basemap.at" target="_blank" property="dct:title">basemap.at</a> }',
    visible: false,
    maxZoom: 18,
    protocol: 'xyz',
  },
  bodenwertigkeitskarte_agri: {
    name: 'Soil value - Cropland - bodenkarte.at',
    id: 'bodenwertigkeitskarte_agri',
    styleFile: 'https://bodenkarte.at/styles/ackerwert.json',
    attribution: '{ Digital soil map Austria; <a href="https://bodenkarte.at" target="_blank"> Digitale Bodenkarte</a> }',
    visible: false,
    maxZoom: 17,
    protocol: 'vectortile',
  },
  bodenwertigkeitskarte_grassland: {
    name: 'Soil value - Grassland - bodenkarte.at',
    id: 'bodenwertigkeitskarte_grassland',
    styleFile: 'https://bodenkarte.at/styles/gruenlandwert.json',
    attribution: '{ Digital soil map Austria; <a href="https://bodenkarte.at" target="_blank"> Digitale Bodenkarte</a> }',
    visible: false,
    maxZoom: 17,
    protocol: 'vectortile',
  },
  dsr_schnelllade_10km: {
    name: 'Funding map for fast charging stations',
    id: 'schnellade',
    styleFile: 'data/gtif/data/schnelllade.json',
    attribution: '{ Funding map: green = enough fast charging available, grey = subsidies available - source <a href="https://www.austriatech.at/" target="_blank"> Austriatech </a> }',
    visible: false,
    maxZoom: 17,
    protocol: 'vectortile',
  },
  CORINE_LAND_COVER: {
    baseUrl: `https://creodias.sentinel-hub.com/ogc/wms/${shConfig.shInstanceIdGtif}`,
    protocol: 'WMS',
    format: 'image/png',
    tileSize: 512,
    name: 'CORINE Land cover',
    layers: 'CORINE_LAND_COVER',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    visible: false,
    minZoom: 7,
  },
  ESA_WORLD_COVER: {
    baseUrl: `https://services.sentinel-hub.com/ogc/wms/${shConfig.shInstanceIdGtif}`,
    protocol: 'WMS',
    format: 'image/png',
    tileSize: 512,
    name: 'ESA World cover',
    layers: 'ESA_WORLD_COVER',
    attribution: '{ <a href="https://eodashboard.org/terms_and_conditions" target="_blank">Use of this data is subject to Articles 3 and 8 of the Terms and Conditions</a> }',
    visible: false,
    minZoom: 6,
  },
  mapboxHighReso: {
    name: 'Mapbox high resolution',
    url: `//api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg?access_token=${shConfig.mbAccessToken}`,
    attribution: '{ <a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a>, <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>, <a href="https://www.maxar.com/" target="_blank">© Maxar</a> }',
    visible: false,
    protocol: 'xyz',
  },
  s2AT2021: {
    name: 'Sentinel-2 Autrian mosaic 2021',
    attribution: '{ Contains modified Copernicus Sentinel data 2021 }',
    visible: false,
    protocol: 'cog',
    sources: [
      { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/JR/S2_Austrian_Mosaic_rendered_2021_COG.tif' },
    ],
    normalize: true,
  },
  s2AT2022: {
    name: 'Sentinel-2 Autrian mosaic 2022',
    attribution: '{ Contains modified Copernicus Sentinel data 2022 }',
    visible: false,
    protocol: 'cog',
    sources: [
      { url: 'https://eox-gtif-public.s3.eu-central-1.amazonaws.com/FCM/v2/JR/S2_Austrian_Mosaic_rendered_2022_COG.tif' },
    ],
    normalize: true,
  },
});

export const overlayLayers = Object.freeze({
  eoxOverlay: {
    name: 'Overlay labels',
    url: '//s2maps-tiles.eu/wmts/1.0.0/overlay_base_bright_3857/default/g/{z}/{y}/{x}.jpg',
    attribution: '{ Overlay: Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors, Made with Natural Earth, Rendering &copy; <a href="//eox.at" target="_blank">EOX</a> }',
    visible: false,
    maxZoom: 14,
    protocol: 'xyz',
  },
  powerOpenInfrastructure: {
    name: 'Power Open Infrastructure Map',
    protocol: 'maplibre',
    visible: false,
    zIndex: 4,
    maplibreStyles: {
      version: 8,
      sprite: `${window.location.protocol}//${window.location.hostname}${window.location.port === '' ? '' : `:${window.location.port}`}/data/gtif/data/openinframap/sprite`,
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      id: 'openinframap',
      name: 'OpenInfraMap',
      layers: powerOpenInsfrastructureStyle,
      sources: {
        openinframap: {
          type: 'vector',
          url: 'data/gtif/data/openinframap/openinframap.json',
        },
      },
    },
  },
});
