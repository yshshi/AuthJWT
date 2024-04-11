import express from 'express';
const router = express.Router();
import UserController from '../Controllers/userController.js';
import ProductController from '../Controllers/productController.js';

//Public route
router.post('/register', UserController.UserRegistration)
router.post('/login', UserController.userLogin)
router.post('/logOut', UserController.logOut)
router.post('/update', UserController.editUser)
router.post('/addProduct', ProductController.createProduct)
router.post('/getAllProduct', ProductController.getAllProduct)


export default router