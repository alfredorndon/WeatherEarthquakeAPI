const { body, validationResult } = require('express-validator');

exports.validateWeatherReport = [
  body('city').isString().notEmpty().withMessage('City is required and must be a string'),
  body('temperature').isNumeric().withMessage('Temperature must be a number'),
  body('humidity').isNumeric().withMessage('Humidity must be a number'),
  body('condition').isIn(['Soleado', 'Nublado', 'Lluvioso', 'Tormenta']).withMessage('Invalid weather condition'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 