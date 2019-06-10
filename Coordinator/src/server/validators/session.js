import Joi from '@hapi/joi';

import * as methods from '../constants/methods';
import paramTypes from '../constants/params';

/**
 * Validator for the session creation request.
 */

export const openSessionValidator = (req, res, next) => {
  const allowedOperationMethods = Object.values(methods.allowedOperationMethods);
  const allowedCompensationMethods = Object.values(methods.allowedCompensationMethods);
  const allowedParamTypes = Object.values(paramTypes);
  const allowedActions = ['operation', 'compensation'];
  const transactionSteps = req.body.transaction ? req.body.transaction.length : 0;

  /* Schemas for params */

  const dependencyItemSchema = Joi.object().keys({
    fromStep: Joi.number().integer().min(1).max(transactionSteps).required(),
    fromAction: Joi.string().valid(allowedActions).required(),
    paramType: Joi.string().valid(allowedParamTypes).required(),
    inputParamKey: Joi.string().required(),
    outputParamKey: Joi.string(),
  });

  const transactionItemSchema = Joi.object().keys({
    index: Joi.number().integer().min(1).required(),
    operation: Joi.object().keys({
      method: Joi.string().valid(allowedOperationMethods).required(),
      url: Joi.string().uri().required(),
      params: Joi.object(),
      dependencies: Joi.array().items(dependencyItemSchema),
    }).required(),
    compensation: Joi.object().keys({
      method: Joi.string().valid(allowedCompensationMethods).required(),
      url: Joi.string().uri().required(),
      params: Joi.object(),
      dependencies: Joi.array().items(dependencyItemSchema),
    }).required(),
  });

  const bodySchema = Joi.object().keys({
    callbackUrl: Joi.string().uri().required(),
    transaction: Joi.array().items(transactionItemSchema).min(1).required(),
  });

  const result = Joi.validate(req.body, bodySchema);

  if (result.error) {
    res.status(400).json(result.error);
  } else {
    next();
  }
};