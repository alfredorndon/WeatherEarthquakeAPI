const { body, validationResult } = require('express-validator');

exports.validateEarthquakeReport = [
  body('magnitude').isNumeric().withMessage('Magnitude must be a number'),
  body('depth').isNumeric().withMessage('Depth must be a number'),
  body('location').isString().notEmpty().withMessage('Location is required and must be a string'),
  body('date').isISO8601().toDate().withMessage('Date must be a valid ISO8601 date'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateEarthquakeReportUpdate = [
  body('magnitude').optional().isNumeric().withMessage('Magnitude must be a number'),
  body('depth').optional().isNumeric().withMessage('Depth must be a number'),
  body('location').optional().isString().notEmpty().withMessage('Location must be a non-empty string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 