import express from 'express';
import locationController from '../../controllers/locationController.js';
const LocationRoutes = express.Router();

LocationRoutes.get('/provinces', locationController.getProvinces)
LocationRoutes.get('/districts', locationController.getDistricts)
LocationRoutes.get('/wards', locationController.getWards);
export default LocationRoutes