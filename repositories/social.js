const Users = require("../schema/users"); 
const bookmark = require("../schema/bookmark");
const moment = require('moment')
const date = moment().format('YYYY-MM-DD HH:mm:ss')

class SocialRepository {
  // DB 상에 그 userId가 없을 경우 생성
  createUser = async(userId, nickName, myPlace, age, gender, likeGame, admin) => {
    const createUser = await Users.create({userId, nickName, myPlace, age, gender, likeGame, admin, visible:"V", createdAt: date, updatedAt: date, expireAt: date
    });
    await bookmark.create({ nickName });
    return createUser;
  }

  // 유저 nickname 찾기
  findUserAccountNick = async (nickName) => {
    const findUserAccountData = await Users.findOne({
      nickName: nickName,
    });
    return findUserAccountData;
  };

  // DB 상에서 userId를 가진 유저가 있는지 체크
  findUser = async (userId) => {
    const findUser = await Users.findOne({userId : userId})
    return findUser;
  }

  // DB 에 refresh token updata
  updateRefresh = async(userId, refresh_token) => {
    const updateRefresh = await Users.updateOne(
      { userId: userId },
      { $set: { refresh_token: refresh_token } }
    );
    return updateRefresh;
  }
}

module.exports = SocialRepository;