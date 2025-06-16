import express from 'express'
import orderController from '../../../controllers/Admin/orderController.js';

const orderRoutes = express.Router();
orderRoutes.get('/', orderController.getAll);
orderRoutes.get('/:id', orderController.detail);
orderRoutes.post('/:id/changeStatus', orderController.changeStatus)
export default orderRoutes

