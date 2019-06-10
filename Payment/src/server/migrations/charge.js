export default {
  up: (migration, DataTypes, done) => {
    migration.createTable("Charge", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      amount: { type: DataTypes.INTEGER, allowNull: false },
      currency: { type: DataTypes.STRING, allowNull: false },
      source: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: true },
      metadata: { type: DataTypes.STRING, allowNull: true },
    }).done(done);
  },
  down: (migration, DataTypes, done) => {
    migration.dropTable("Charge").done(done);
  }
};