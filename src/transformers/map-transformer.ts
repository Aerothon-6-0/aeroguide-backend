export const MapMatrixTransformer = (
  matrix: any,
  source: any,
  destination: any,
  // departure: any,
) => {
  const modifiedObj = {
    source,
    destination,
    coordinates: matrix,
    // departure,
  };
  return modifiedObj;
};
