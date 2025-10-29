// Type declaration for "@changey/react-leaflet-markercluster" — adds TypeScript support for clustering markers in React-Leaflet maps.
declare module "@changey/react-leaflet-markercluster" {
  import { LayerGroup, Layer } from "leaflet";
  import { Component } from "react";

  interface MarkerClusterGroupProps {
    children?: React.ReactNode;
    chunkedLoading?: boolean;
    disableClusteringAtZoom?: number;
    showCoverageOnHover?: boolean;
    zoomToBoundsOnClick?: boolean;
    spiderfyOnMaxZoom?: boolean;
    removeOutsideVisibleBounds?: boolean;
  }

  export default class MarkerClusterGroup extends Component<MarkerClusterGroupProps> {}
}
