import express from 'express'
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import mainController from '../../../controllers/Client/mainController.js';
import validateBody from '../../../middlewares/validateBody.js';
import orderValidate from '../../../validators/orderValidate.js';
import AuthRoutes from './auth.routes.js';
import { io } from '../../../server.js';
import commentRoutes from './commentRoutes.js';
import { verifyToken } from '../../../middlewares/verifyToken.js';

const MainRoutes = express.Router();

MainRoutes.get('/', mainController.homePage)
MainRoutes.use('/categories', categoryRoutes)
MainRoutes.use('/products', productRoutes)
MainRoutes.post('/cart', mainController.cartPage);
MainRoutes.post('/checkout', mainController.checkoutPage);
MainRoutes.post('/create_payment_url', validateBody(orderValidate), mainController.createPaymentUrl);
MainRoutes.get('/vnpay_ipn', mainController.getVnpIpn);
MainRoutes.get('/search', mainController.search)
MainRoutes.use('/auth', AuthRoutes)

MainRoutes.use('/comments', commentRoutes)

export default MainRoutes