declare module "react-leaflet-heatmap-layer-v3" {
  import { LayerProps } from "react-leaflet";

  export interface HeatmapLayerProps extends LayerProps {
    fitBoundsOnLoad?: boolean;
    fitBoundsOnUpdate?: boolean;
    points: { lat: number; lng: number; intensity?: number }[];
    longitudeExtractor?: (m: any) => number;
    latitudeExtractor?: (m: any) => number;
    intensityExtractor?: (m: any) => number;
    max?: number;
    radius?: number;
    blur?: number;
  }

  export const HeatmapLayer: React.FC<HeatmapLayerProps>;
  export default HeatmapLayer;
}
