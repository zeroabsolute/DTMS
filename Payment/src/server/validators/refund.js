import Joi from '@hapi/joi';

/**
 * Validator for posting a refund.
 */

export const postRefundValidator = (req, res, next) => {
  const bodySchema = Joi.object().keys({
    amount: Joi.number().min(1).required(),
    chargeId: Joi.number().min(1).required(),
    description: Joi.string(),
    metadata: Joi.object(),
  });

  const result = Joi.validate(req.body, bodySchema);

  if (result.error) {
    res.status(400).json(result.error);
  } else {
    next();
  }
};