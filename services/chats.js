const ChatsRepository = require("../repositories/chats");     

class ChatsService {
  // 새 인스턴스 생성
  chatsRepository = new ChatsRepository();

  updateSocket = async (room) => {
    const updateSocket = await this.chatsRepository.updateSocket(room);
    return updateSocket;
  }
}

module.exports = ChatsService;
