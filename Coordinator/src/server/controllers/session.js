import cuid from 'cuid';

import logger from '../logger';

/**
 * Open a transaction session.
 * 
 * @swagger
 *
 * paths:
 *  /session:
 *    post:
 *      tags:
 *        - Session
 *      summary: Start transaction
 *      description: Opens a transaction session and returns a transaction id.
 *      parameters:
 *        - name: body
 *          in: body
 *          description: Transaction body parameters
 *          schema:
 *            required:
 *              - transaction
 *              - callbackUrl
 *            properties:
 *              callbackUrl:
 *                type: string
 *              transaction:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    index:
 *                      type: number
 *                    operation:
 *                      type: object
 *                      properties:
 *                        method:
 *                          type: string
 *                          enum: [POST]
 *                        url:
 *                          type: string
 *                        params:
 *                          type: object
 *                        dependencies:
 *                          type: array
 *                          items:
 *                            properties:
 *                              fromStep:
 *                                type: number
 *                              fromAction:
 *                                type: string
 *                                enum: [operation, compensation]
 *                              paramType:
 *                                type: string
 *                                enum: [path, body, query]
 *                              inputParamKey:
 *                                type: string
 *                              outputParamKey:
 *                                type: string
 *                    compensation:
 *                      type: object
 *                      properties:
 *                        method:
 *                          type: string
 *                          enum: [POST, PUT, DELETE, PATCH, GET]
 *                        url:
 *                          type: string
 *                        params:
 *                          type: object
 *                        dependencies:
 *                          type: array
 *                          items:
 *                            properties:
 *                              fromStep:
 *                                type: number
 *                              fromAction:
 *                                type: string
 *                                enum: [operation, compensation]
 *                              paramType:
 *                                type: string
 *                                enum: [path, body, query]
 *                              inputParamKey:
 *                                type: string
 *                              outputParamKey:
 *                                type: string
 *      responses:
 *        200:
 *          description: Request processed successfully
 *          schema:
 *            properties:
 *              sessionId:
 *                type: string
 *        400:
 *          $ref: "#/responses/400"
 *        500:
 *          $ref: "#/responses/500"
 */

export const openSession = async (req, res) => {
  try {
    const sessionId = cuid();

    res.status(200).json({
      sessionId,
    });
  } catch (e) {
    logger.getLogger().error(e);
    res.status(500).json(e);
  }
};