const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("order", {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    state: {
      type: DataTypes.ENUM("pendiente", "confirmado", "entregado", "cancelado"),
      defaultValue: "pendiente",
    },
    review: {
      type: DataTypes.INTEGER,
      min: 0,
      max: 5,
      // TODO agregar condición de que sólo se puede modificar cuando el pedido está en estado entregado
    },
    /* payId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }, */
  });
};
