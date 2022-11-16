const ChatsService = require("../services/chats");    
require("dotenv").config();

class ChatsController {
  chatsService = new ChatsService();

  updateSocket = async (req, res, nex) => {
    const { room } = req.params
    const updateSocket = await this.chatsService.updateSocket(room);
    res.status(200).json({ updateSocket : updateSocket });
  }
}

module.exports = ChatsController;
