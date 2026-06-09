import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { CustomerController } from '../controllers/CustomerController';
import { ProductController } from '../controllers/ProductController';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Customers
router.post('/customers', CustomerController.create);
router.get('/customers', CustomerController.list);
router.get('/customers/:id', CustomerController.getById);
router.put('/customers/:id', CustomerController.update);
router.delete('/customers/:id', CustomerController.delete);

// Products
router.post('/products', ProductController.create);
router.get('/products', ProductController.list);
router.get('/products/:id', ProductController.getById);
router.put('/products/:id', ProductController.update);
router.delete('/products/:id', ProductController.delete);

// Orders
router.post('/orders', OrderController.create);
router.get('/orders', OrderController.list);
router.get('/orders/:id', OrderController.getById);
router.put('/orders/:id/status', OrderController.updateStatus);
router.post('/orders/:id/invoice', OrderController.generateInvoice);

export default router;
