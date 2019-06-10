/**
 * @swagger
 *
 * definitions:
 *  Charge:
 *    type: object
 *    required:
 *      - id
 *      - createdAt
 *      - updateddAt
 *      - amount
 *      - currency
 *      - source
 *    properties:
 *      id:
 *        type: number
 *      createdAt:
 *        type: string
 *      updatedAt:
 *        type: string
 *      amount:
 *        type: number
 *      currency:
 *        type: string
 *      source:
 *        type: string
 *      description:
 *        type: string
 *      metadata:
 *        type: string
 */

export default (Sequelize, DataTypes) => {
  const model = {
    amount: { type: DataTypes.INTEGER, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    source: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    metadata: { type: DataTypes.STRING, allowNull: true },
  };

  const Charge = Sequelize.define('Charge', model);

  return Charge;
};