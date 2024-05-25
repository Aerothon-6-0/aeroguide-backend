import { Request, Response } from 'express';
import { PrismaService } from '../services/prisma-service';
import { WeatherService } from '../services/weather-service';
import axios from 'axios';
const Amadeus = require('amadeus');

export const EmergencyController = {
    async addEmergency(req: Request, res: Response) {
      try {


        const {
            flightId,
            electronicFailure,
            visibilityIssue,
            otherRisks,
            riskLevel,
            currentLocation

        } = req.body;

        const weather = await WeatherService.getWeatherByLatLong(currentLocation[0],currentLocation[1]);

        const weatherCondition = await PrismaService.addWeather(
            new Date(),
            currentLocation,
            weather.current.temperature2m,
            weather.current.windSpeed10m,
            weather.current.windDirection10m,
            70,
            20,
            'bad',
            flightId
        )

        const weatherConditionId = weatherCondition.id;
        let suggestedAction = "";

        if(riskLevel === 'High') suggestedAction = "Emergency landing";

        const risk = await PrismaService.addRiskAssessemnt(flightId,
            new Date(),
            weatherConditionId,
            electronicFailure,
            visibilityIssue,
            otherRisks,
            riskLevel,
            suggestedAction
        );

        // const amadeus =  new Amadeus({
        //     clientId: process.env.AMADEUS_API_KEY,
        //     clientSecret: process.env.AMADEUS_API_SECRET
        //   });



  const lat = currentLocation[0];
  const long = currentLocation[1];
//    const response = await amadeus.referenceData.locations.airports.get({
//     latitude: lat,
//     longitude: long
// });

//   const responseData = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/airports', {
//       params: {
//         lat,long
//       },
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });



       // const nearestAirport = response.result


        res.status(200).json({ message: 'risk assessment' , data: risk});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    },
  };