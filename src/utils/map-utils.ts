import { Bounds } from '../interfaces/map-interface';

// Function to calculate the change in latitude for a given distance
export const changeInLatitude = (distance: number) => {
  const earthRadius = 6371; // Earth's radius in km
  return (distance / earthRadius) * (180 / Math.PI);
};

// Function to calculate the change in longitude for a given distance at a specific latitude
export const changeInLongitude = (distance: number, latitude: number) => {
  const earthRadius = 6371; // Earth's radius in km
  const latRad = latitude * (Math.PI / 180);
  return (distance / (earthRadius * Math.cos(latRad))) * (180 / Math.PI);
};

export const generateMatrix = (bounds: Bounds, distance: number) => {
  const { north_east, south_west, north_west, south_east } = bounds;
  const latStep = changeInLatitude(distance);

  const latLongMatrix = [];
  // Iterate from south to north
  for (let lat = north_west.lat; lat <= south_west.lat; lat += latStep) {
    const longStep = changeInLongitude(distance, lat); // Recalculate longStep for the current latitude

    const row = [];
    // Iterate from west to east
    for (
      let long = north_west.long;
      long <= north_east.long;
      long += longStep
    ) {
      row.push({ lat, long });
    }
    latLongMatrix.push(row);
  }

  return latLongMatrix;
};
