const {Router} = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUser);
/**
 * @route POST /api/auth/login
 * @desc Login an existing user
 * @access Public
 */
authRouter.post('/login', authController.loginUser);
/**
 * @route GET /api/auth/logout
 * @desc Logout a user
 * @access Public
 */
authRouter.get('/logout', authMiddleware, authController.logoutUser);
/**
 * @route GET /api/auth/get-me
 * @desc Get the currently logged-in user's information
 * @access Private
 */
authRouter.get('/get-me', authMiddleware, authController.getMe);

module.exports = authRouter;