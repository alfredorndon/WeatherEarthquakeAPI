const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Por favor, introduce un correo electrónico válido.'),
        body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    ],
    authController.registerUser
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Por favor, introduce un correo electrónico válido.'),
        body('password').notEmpty().withMessage('La contraseña es requerida.'),
    ],
    authController.loginUser
);

module.exports = router; 