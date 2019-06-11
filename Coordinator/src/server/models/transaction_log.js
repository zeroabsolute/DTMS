import mongoose from 'mongoose';

import states from '../constants/states';

const Schema = mongoose.Schema;

/**
 * @swagger
 *
 * definitions:
 *  TransactionInput:
 *    type: array
 *    items:
 *      type: object
 *      properties:
 *        index:
 *          type: number
 *        operation:
 *          type: object
 *          properties:
 *            method:
 *              type: string
 *              enum: [POST]
 *            url:
 *              type: string
 *            params:
 *              type: object
 *            dependencies:
 *              type: array
 *              items:
 *                properties:
 *                  fromStep:
 *                    type: number
 *                  fromAction:
 *                    type: string
 *                    enum: [operation, compensation]
 *                  paramType:
 *                    type: string
 *                    enum: [path, body, query]
 *                  inputParamKey:
 *                    type: string
 *                  outputParamKey:
 *                    type: string
 *        compensation:
 *          type: object
 *          properties:
 *            method:
 *              type: string
 *              enum: [POST, PUT, DELETE, PATCH, GET]
 *            url:
 *              type: string
 *            params:
 *              type: object
 *            dependencies:
 *              type: array
 *              items:
 *                properties:
 *                  fromStep:
 *                    type: number
 *                  fromAction:
 *                    type: string
 *                    enum: [operation, compensation]
 *                  paramType:
 *                    type: string
 *                    enum: [path, body, query]
 *                  inputParamKey:
 *                    type: string
 *                  outputParamKey:
 *                    type: string
 *  TransactionOutput:
 *    type: array
 *    items:
 *      type: object
 *      properties:
 *        index:
 *          type: number
 *        result:
 *          type: object
 *  TransactionStatus:
 *    type: array
 *    items:
 *      type: object
 *      properties:
 *        index:
 *          type: number
 *        state:
 *          type: string
 *          enum: [pending, started, succeeded, failed]
 *  TransactionLog:
 *    type: object
 *    required:
 *      - _id
 *      - transactionCuid
 *      - createdAt
 *      - updatedAt
 *      - input
 *      - output
 *      - status
 *    properties:
 *      _id:
 *        type: string
 *      transactionCuid:
 *        type: string
 *      createdAt:
 *        type: string
 *      updatedAt:
 *        type: string
 *      input:
 *        $ref: "#/definitions/TransactionInput"
 *      output:
 *        $ref: "#/definitions/TransactionOutput"
 *      status:
 *        $ref: "#/definitions/TransactionStatus"
 */


/**
 * Dependencies represent params which must be exchanged between 
 * different transaction steps.
 * 
 * @param fromStep: Index of the transaction step
 * @param fromAction: Either 'operation' or 'compensation' (which part of the transaction step)
 * @param paramType: Param type specification according to openAPI: [body, path, query]
 * @param inputParamKey: The name of the param, as returned by the previos step ~ (fromStep['fromAction'])
 * @param outputParamKey: The name of the param that will be passed to the current step request
 */
const dependenciesSchema = {
  fromStep: { type: 'Number', required: true },
  fromAction: { type: 'String', required: true },
  paramType: { type: 'String', required: true },
  inputParamKey: { type: 'String', required: true },
  outputParamKey: { type: 'String', required: false },
};

/**
 * A transaction log contains the following fields:
 * 
 * @param transactionCuid: A random generated cuid.
 * @param input: The request body, as received by the requesting service
 *    @param input.callbackUrl: A POST endpoint, will be called at the end of the transaction by the orchestrator
 *    @param input.transaction: An array of transaction steps
 *        @param input.transaction[i].operation: Forward operation (Ti)
 *        @param input.transaction[i].compensation: Compensating transaction (Ci)
 * @param output: The transaction result for each step
 *    @param output[i].index
 *    @param output[i].result
 * @param status: Status for each transaction step
 *    @param status[i].index
 *    @param status[i].state: [pending, started, succeeded, failed]
 */

const transactionLogSchema = new Schema(
  {
    transactionCuid: { type: 'String', required: true, index: true },
    input: {
      callbackUrl: { type: 'String', required: true },
      transaction: [
        {
          index: { type: 'Number', required: true },
          operation: {
            method: { type: 'String', required: true },
            url: { type: 'String', required: true },
            params: {},
            dependencies: [dependenciesSchema],
          }, 
          compensation: {
            method: { type: 'String', required: true },
            url: { type: 'String', required: true },
            params: {},
            dependencies: [dependenciesSchema],
          }
        }
      ],
    },
    output: [
      {
        index: { type: 'Number', required: true },
        result: {}
      }
    ],
    status: [
      {
        index: { type: 'Number', required: true },
        state: {
          type: 'String',
          enum: Object.values(states),
        }
      }
    ]
  }, {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    }
  }
);

export default mongoose.model('TransactionLog', transactionLogSchema);