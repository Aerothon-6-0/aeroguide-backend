export interface Bounds {
  north_east: {
    lat: number;
    long: number;
  };
  south_west: {
    lat: number;
    long: number;
  };
  north_west: {
    lat: number;
    long: number;
  };
  south_east: {
    lat: number;
    long: number;
  };
  source: {
    lat: number;
    long: number;
  };
  destination: {
    lat: number;
    long: number;
  };
}
