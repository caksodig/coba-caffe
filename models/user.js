'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.transaksi, {
        foreignKey: 'userId', as: 'transaksi'
      })
    }
  }
  user.init({
    nama_user: DataTypes.STRING,
    role: DataTypes.ENUM('admin','kasir','manajer'),
    username: DataTypes.STRING,
    password: DataTypes.TEXT,
    foto: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};