const Room = require("../schema/room");

class ChatsRepository {
  updateSocket = async (room) => {
    const updateSocket = await Room.findOne({room : room})
    return updateSocket;
  }

}

module.exports = ChatsRepository;
