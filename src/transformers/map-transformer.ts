export const MapMatrixTransformer = (
  matrix: any,
  source: any,
  destination: any,
) => {
  const modifiedObj = {
    source,
    destination,
    coordinates: matrix,
  };
  return modifiedObj;
};
