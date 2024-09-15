import { sequelize } from '../lib/db';
import { DataTypes, Model } from 'sequelize';

export class User extends Model {
  // Define your User model properties here
}

User.init({
  // Define your User model fields here
}, {
  sequelize,
  modelName: 'User'
});
