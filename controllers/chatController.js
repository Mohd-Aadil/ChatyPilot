import { Sequelize } from "sequelize";
import { Chat } from "../models/chatModel.js";
// import { getAIResponse } from "../services/geminiService.js";
import { Op } from "sequelize";
import { Conversation } from "../models/conversationModel.js";
import { getAIResponse } from "../services/apiProvider.js";

export const chatHandler = async (req, res) => {
  try {
    let { message, conversationId, provider } = req.body;
    // console.log("reqbody", req.body);

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let conversation;

    // 🆕 Create new conversation if not provided
    if (!conversationId) {
      conversation = await Conversation.create({
        userId: req.userId,
        title: "New Chat",
      });

      conversationId = conversation.id;
    } else {
      conversation = await Conversation.findOne({
        where: { id: conversationId, userId: req.userId },
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
    }

    // 🔍 Fetch previous chats
    const previousChats = await Chat.findAll({
      where: { conversationId },
      order: [["createdAt", "DESC"]],
      limit: 6,
    });

    // 🧠 Convert to correct order
    const orderedChats = [...previousChats].reverse();

    const history = orderedChats.flatMap((chat) => [
      {
        role: "user",
        parts: [{ text: chat.userMessage }],
      },
      {
        role: "model",
        parts: [{ text: chat.aiResponse }],
      },
    ]);

    // 🎯 System prompt
    const systemPrompt = {
      role: "user",
      parts: [
        {
          text: "You are a helpful assistant. Keep answers clear and short.",
        },
      ],
    };

    // 📦 Final contents
    const contents = [
      systemPrompt,
      ...history,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];
    // console.log("provider", provider);

    // 🤖 Get AI response
    const aiResponse = await getAIResponse(provider, contents);

    // 🏷️ Generate title ONLY for first message
    if (previousChats.length === 0) {
      const titlePrompt = [
        {
          role: "user",
          parts: [
            {
              text: `Generate ONLY ONE short 3-5 word title.

Rules:
- Single title only
- No numbering
- No extra text
- Plain text only

Message: ${message}`,
            },
          ],
        },
      ];

      let title = await getAIResponse(provider, titlePrompt);

      // 🧹 Clean title
      title = title
        .split("\n")[0]
        .replace(/[*#0-9.-]/g, "")
        .trim()
        .split(" ")
        .slice(0, 5)
        .join(" ");

      await conversation.update({ title });
    }

    // 💾 Save chat
    await Chat.create({
      conversationId,
      userMessage: message,
      aiResponse,
    });

    return res.status(200).json({
      success: true,
      reply: aiResponse,
      conversationId,
    });
  } catch (error) {
    console.error("Chat Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      where: { userId: req.userId },
      attributes: ["id", "title", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    // console.log("conversations", conversations);

    if (conversations.length <= 0) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get Conversations Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const renameConversation = async (req, res) => {
  try {
    const { title, conversationId } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "title required",
      });
    }

    const conversation = await Conversation.findOne({
      where: {
        id: conversationId,
        userId: req.userId,
      },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or not authorized",
      });
    }

    await conversation.update({ title });

    return res.status(200).json({
      success: true,
      message: "Conversation renamed successfully",
    });
  } catch (error) {
    console.error("rename Conversation Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.body;
    // console.log("conversationId", conversationId);

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "conversationId is required",
      });
    }

    // 🔒 Check if conversation belongs to user
    const conversation = await Conversation.findOne({
      where: {
        id: conversationId,
        userId: req.userId,
      },
    });
    // console.log("Conversation", conversation);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found or not authorized",
      });
    }

    // 🗑️ Delete all chats of this conversation
    await Chat.destroy({
      where: { conversationId },
    });

    // 🗑️ Delete conversation
    await Conversation.destroy({
      where: { id: conversationId },
    });

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Delete Conversation Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
// import { getAIResponse } from "../services/geminiService.js";

// export const chatHandler = async (req, res) => {
//   try {
//     const { message } = req.body;

//     const aiResponse = await getAIResponse(message);

//     res.json({ reply: aiResponse });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };

// import { Chat } from "../models/chatModel.js";
// import { getAIResponse } from "../services/openaiService.js";

// export const chatHandler = async (req, res) => {
//   try {
//     const { message } = req.body;

//     // 🔥 Get last 5 chats for context
//     const previousChats = await Chat.findAll({
//       order: [["createdAt", "DESC"]],
//       limit: 5,
//     });

//     const messages = [
//       { role: "system", content: "You are a helpful assistant" },
//       ...previousChats.reverse().flatMap(chat => ([
//         { role: "user", content: chat.userMessage },
//         { role: "assistant", content: chat.aiResponse }
//       ])),
//       { role: "user", content: message }
//     ];

//     const aiResponse = await getAIResponse(messages);

//     // Save to DB
//     await Chat.create({
//       userMessage: message,
//       aiResponse,
//     });

//     res.json({ reply: aiResponse });

//   } catch (error) {
//   if (error.code === "insufficient_quota") {
//     return res.status(429).json({
//       error: "API quota exceeded. Please check billing."
//     });
//   }

//   console.error(error);
//   res.status(500).json({ error: "Something went wrong" });
// }
// };
