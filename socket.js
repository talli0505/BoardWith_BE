const SocketIO = require("socket.io");
// 몽구스 연결
const connect = require("./schema");
connect();
const Room = require("./schema/room");
const Posts = require("./schema/posts");
const Users = require("./schema/users");

module.exports = (server) => {
  // path 설정 하지 말기
  const io = SocketIO(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", socket => {
    socket.on("joinRoom", async data => {
      let {nickName, room, userAvatar} = data
      socket.join(room)
      const findRoom = await Room.findOne({ room: room });
      if(!findRoom) {
        console.log("신규")
        await Room.create({owner : nickName, room : room, member: {nickName : nickName, userAvatar :userAvatar}})
        // const user = await Users.findOne({nickName : nickName}) 
        io.to(room).emit("roomUsers", [{nickName : nickName, userAvatar : userAvatar}])
      } else {
        console.log("추가")
        console.log(findRoom.member)
        if(!findRoom.member.includes(nickName)) {
          await Room.updateOne({ room : room }, {$push: {member : {nickName : nickName, userAvatar :userAvatar}}})
        } 
        const RoomM = await Room.findOne({room : room})
        // const user = await Users.findOne({nickName : nickName}) 
        io.to(room).emit("roomUsers", RoomM.member)
      }
      socket.broadcast.to(room).emit('notice', `${nickName}님이 채팅방에 입장하셨습니다.`)
    })

    socket.on("chatMessage", async data => {
      let {room, nickName, message, userAvatar} = data
      // const user = await Users.findOne({nickName : nickName}) 
      await Room.updateOne(
              { room: room },
              {
                $push: {
                  chat: {
                    nickName: nickName,
                    message: message,
                    userAvatar : userAvatar,
                    time: Date.now(),
                  },
                },
              }
            );
      io.to(room).emit('message', {...data})
    })

    // 퇴장
    socket.on("leave-room", async (data) => {
      console.log("빠이빠이")
      let { nickName, room } = data;
      await Room.updateOne(
                { room: room },
                { $pull: { member: {nickName : nickName}} }
              );        
      socket.broadcast.to(room).emit("notice", `${nickName}님 이 퇴장 하셨습니다.`);
      const RoomM = await Room.findOne({room : room})
      io.to(room).emit("roomUsers", nickName)
    });

    // 벤 -> 다른사람이 강퇴 못하도록 로직을 막기 (transection을 어떻게 챙길수있는지)
    socket.on("ban", async (data) => {
      let { nickName, room } = data;
  
      if (nickName) {
        // 나갔을 때 퇴장 했다는 메세지 프론트에게 보내줌
        socket.broadcast.to(room).emit("notice", `${nickName}님이 강퇴 당하셨습니다.`);
  
        await Room.updateOne(
          { room: room },
          { $pull: { member: {nickName : nickName} } }
        );
  
        io.emit("banUsers", nickName);
      }
      Posts.updateOne({_id:room},{$push:{banUser: nickName}})
      await Posts.updateOne({_id:room},{$pull:{confirmMember: nickName}})
      const RoomM = await Room.findOne({room : room})
      io.to(room).emit("roomUsers", RoomM.member)
    });
      
  })

};