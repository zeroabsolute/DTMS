export default {
  up: (migration, DataTypes, done) => {
    migration.createTable("Refund", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      amount: { type: DataTypes.INTEGER, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: true },
      metadata: { type: DataTypes.STRING, allowNull: true },
      chargeId: {
        type: DataTypes.UUID,
        references: {
          model: 'Charge',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    }).done(done);
  },
  down: (migration, DataTypes, done) => {
    migration.dropTable("Refund").done(done);
  }
};