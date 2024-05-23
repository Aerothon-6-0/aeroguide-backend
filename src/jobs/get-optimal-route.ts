import cron from 'node-cron';
export const GetOptimalRouteJob = () => {
  cron.schedule('* * * * *', async () => {
    //get scheduled flight from next 5min
    // create the matrix for the flight
    // get the weather info of the flight matrix
    // call the aeroguide service with all the info
  });
};
