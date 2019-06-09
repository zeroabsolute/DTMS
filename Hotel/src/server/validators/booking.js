import Joi from '@hapi/joi';

/**
 * Validator for posting a booking.
 */

export const postBookingValidator = (req, res, next) => {
  const bodySchema = Joi.object().keys({
    userId: Joi.string().required(),
    hotelId: Joi.string().required(),
    roomId: Joi.string().required(),
    datetime: Joi.date().min('now').required(),
  });

  const result = Joi.validate(req.body, bodySchema);

  if (result.error) {
    res.status(400).json(result.error);
  } else {
    next();
  }
};