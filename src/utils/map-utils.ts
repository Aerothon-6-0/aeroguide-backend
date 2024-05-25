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

export const getLatAndLangFromMatrix = (matrix: any) => {
  console.log(matrix)
  const lat: number[] = [];
  const long: number[] = [];
  matrix.forEach((row: any) => {
    row.forEach((node: any) => {
      lat.push(node.lat);
      long.push(node.long);
    });
  });
  return { lat, long };
};

export const getLatAndLangFromMatrix2= (matrix: any[]) => {

    // Check if matrix is an array
    if (!Array.isArray(matrix)) {
      throw new Error('matrix is not an array');
    }
  
    const lat: number[] = [];
    const long: number[] = [];
  
    // Iterate over each row in the matrix
    matrix.forEach((row: any, rowIndex: number) => {
      // Check if the current row is an array
      if (!Array.isArray(row)) {
        throw new Error(`Row at index ${rowIndex} is not an array`);
      }
  
      // Iterate over each node in the row
      row.forEach((node: any, nodeIndex: number) => {
        // Check if the node contains lat and long properties
        if (node && typeof node.lat === 'number' && typeof node.long === 'number') {
          lat.push(node.lat);
          long.push(node.long);
        } else {
          throw new Error(`Node at row ${rowIndex}, index ${nodeIndex} does not contain valid lat and long properties`);
        }
      });

    });
    return { lat, long };
  };
  

