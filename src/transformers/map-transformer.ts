export const MapMatrixTransformer = (matrix: any, src: any, dest: any) => {
  const source = {
    lat: src[0],
    long: src[1],
  };
  const destination = {
    lat: dest[0],
    long: dest[1],
  };
  const modifiedObj = {
    source,
    destination,
    coordinates: matrix,
  };
  return modifiedObj;
};
