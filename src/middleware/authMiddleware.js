const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'No autorizado, token fallido (usuario no encontrado).' });
            }
            next();
        } catch (error) {
            console.error('Error de autenticación:', error.message);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expirado, por favor inicie sesión de nuevo.' });
            }
            res.status(401).json({ message: 'No autorizado, token fallido.' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token.' });
    }
}; 