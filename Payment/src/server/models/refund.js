/**
 * @swagger
 *
 * definitions:
 *  Refund:
 *    type: object
 *    required:
 *      - id
 *      - createdAt
 *      - updateddAt
 *      - amount
 *      - chargeId
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
 *      chargeId:
 *        type: number
 *      description:
 *        type: string
 *      metadata:
 *        type: string
 */

export default (Sequelize, DataTypes) => {
  const model = {
    amount: { type: DataTypes.INTEGER, allowNull: false },
    chargeId: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    metadata: { type: DataTypes.STRING, allowNull: true },
  };

  const Refund = Sequelize.define('Refund', model);

  Refund.associate = (models) => {
    Refund.belongsTo(models.Charge);
  };

  return Refund;
};