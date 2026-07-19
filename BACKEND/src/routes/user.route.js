import express from 'express'
import * as userController from '../controllers/user.controller.js'
import { body } from 'express-validator'
import * as authMiddleware from '../middlewares/auth.middleware.js'



const router = express.Router()

router.post('/register', [
    body('email').isEmail().withMessage('Email must be valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 6 characters long'),
    body('username').isLength({min:3}).withMessage('Username must be at least 6 characters long')
], userController.createUserController)



router.post('/login', [
    body('email').isEmail().withMessage('Email must be valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 6 characters long')
], userController.loginController)


router.get('/profile', authMiddleware.authUser, userController.profileController)

router.get('/logout', authMiddleware.authUser, userController.logoutController)

router.get('/all', authMiddleware.authUser, userController.getAllUsersController)

export default router