const SocketIO = require("socket.io");
// 몽구스 연결
const connect = require("./schema");
connect();
const Room = require("./schema/room");
const Ban = require("./schema/ban");
const Posts = require("./schema/posts");

module.exports = (server) => {
  // path 설정 하지 말기
  const io = SocketIO(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", socket => {
    socket.on("joinRoom", async data => {
      let {nickName, room} = data
      socket.join(room)
      const findRoom = await Room.findOne({ room: room });
      if(!findRoom) {
        console.log("신규")
        await Room.create({owner : nickName, room : room, member: nickName })
        io.to(room).emit("roomUsers", ({nickName : nickName, room : room}))
      } else {
        console.log("추가")
        await Room.updateOne({ room : room }, {$push: {member : nickName}})
        const RoomM = await Room.findOne({room : room})
        io.to(room).emit("roomUsers", ({nickName : RoomM.member, room : RoomM.room}))
      }
      io.to(room).emit('notice', `${nickName}님이 채팅방에 입장하셨습니다.`)
    })

    socket.on("chatMessage", async data => {
      let {room, nickName, message} = data
      await Room.updateOne(
              { room: room },
              {
                $push: {
                  chat: {
                    nickName: nickName,
                    message: message,
                    time: Date.now(),
                  },
                },
              }
            );
      io.to(room).emit('message', data)
    })

    // 퇴장
    socket.on("leave-room", async (data) => {
      let { nickName, room } = data;
      await Room.updateOne(
                { room: room },
                { $pull: { member: nickName } }
              );
      io.to(room).emit("notice", `${nickName}님 이 퇴장 하셨습니다.`);
    });

    // 벤 -> 다른사람이 강퇴 못하도록 로직을 막기 (transection을 어떻게 챙길수있는지)
    socket.on("ban", async (data) => {
      let { nickName, room } = data;
  
      if (nickName) {
        // 나갔을 때 퇴장 했다는 메세지 프론트에게 보내줌
        io.to(room).emit("notice", `${nickName}님이 강퇴 당하셨습니다.`);
  
        await Room.updateOne(
          { room: room },
          { $pull: { member: nickName } }
        );
  
        io.emit("banUsers", nickName);
      }
  
      await Ban.create({ room: room, banUser: nickName });
      await Posts.updateOne({_id:room},{$push:{banUser: nickName}})
      await Posts.updateOne({_id:room},{$pull:{participant: nickName}})
      const RoomM = await Room.findOne({room : room})
      io.to(room).emit("roomUsers", ({nickName : RoomM.member, room : RoomM.room}))
    });
      
  })

};