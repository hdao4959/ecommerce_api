import express from 'express';
import locationController from '../../controllers/locationController.js';
const LocationRoutes = express.Router();

LocationRoutes.get('/provinces', locationController.getProvinces)
LocationRoutes.get('/districts', locationController.getDistricts)
export default LocationRoutes