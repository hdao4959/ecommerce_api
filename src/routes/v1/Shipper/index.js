import express from 'express'
import authRoutes from './authRoutes.js'
const ShipperRoutes = express.Router()

ShipperRoutes.use('/auth', authRoutes)

export default ShipperRoutes