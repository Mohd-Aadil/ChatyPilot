// models/conversationModel.js

import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Conversation = sequelize.define("Conversation", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
});
