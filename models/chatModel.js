import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

// export const Chat = sequelize.define("Chat", {
//   userMessage: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
//   aiResponse: {
//     type: DataTypes.TEXT,
//     allowNull: false,
//   },
// });
// models/chatModel.js

export const Chat = sequelize.define("Chat", {
  conversationId: {
  type: DataTypes.INTEGER.UNSIGNED,
},
  userMessage: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  aiResponse: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // 🔥 optional but useful
//   userId: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//   },
//   title: {
//   type: DataTypes.STRING,
// }
});
