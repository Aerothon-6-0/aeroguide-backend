import { Router } from "express";
import { WeatherController } from "../../controllers/weather";

const router = Router();

router.get('/bulk',WeatherController.getBulkWeatherByLatLong)
router.get('/',WeatherController.getWeatherByLatLong)

export default router;