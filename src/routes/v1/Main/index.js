import express from 'express'
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import mainController from '../../../controllers/Client/mainController.js';
import validateBody from '../../../middlewares/validateBody.js';
import orderValidate from '../../../validators/orderValidate.js';

const MainRoutes = express.Router();

MainRoutes.use('/categories', categoryRoutes)
MainRoutes.use('/products', productRoutes)

MainRoutes.get('/', mainController.homePage)
MainRoutes.post('/cart', mainController.cartPage);
MainRoutes.post('/checkout', mainController.checkoutPage);
MainRoutes.post('/create_payment_url', validateBody(orderValidate), mainController.createPaymentUrl);
MainRoutes.get('/vnpay_ipn', mainController.getVnpIpn);
MainRoutes.get('/search', mainController.search)
export default MainRoutes