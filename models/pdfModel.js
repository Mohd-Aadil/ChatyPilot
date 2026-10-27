import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const pdf = sequelize.define("pdf", {
  fileName: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
});
