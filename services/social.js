const SocialRepository = require('../repositories/social')


class SocialService {
  socialRepository = new SocialRepository();

  createUser = async(userId, nickName, myPlace, age, gender, likeGame, admin) => {
    const isSameNickname = await this.socialRepository.findUserAccountNick(nickName);
    
    // 유저 nickname 중복 검사
    if (isSameNickname) {
      const err = new Error(`UserService Error`);
      err.status = 409;
      err.message = "이미 가입된 닉네임이 존재합니다.";
      throw err;
  }

    const createUser = await this.socialRepository.createUser(userId, nickName, myPlace, age, gender, likeGame, admin);
    return createUser;
  }

  findUser = async (userId) => {
    const findUser = await this.socialRepository.findUser(userId)
    return findUser;
  }

  updateRefresh = async(userId, refresh_token) => {
    const updateRefresh = await this.socialRepository.updateRefresh(userId, refresh_token);
    return updateRefresh;
  }
}

module.exports = SocialService;