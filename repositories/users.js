const Users  = require("../models/users");
const Posts = require("../models/posts"); 
const Comments = require("../models/comments"); 
const { Op } = require("sequelize");

class UsersRepository {
  // 회원가입을 위한 함수
  signUp = async (
    id,
    nickname,
    password,
    address,
    likePlace,
    birth,
    gender,
    likeGame,
    salt
  ) => {
    // create로 회원가입
    const createAccountData = await Users.create({
      id,
      nickname,
      password,
      address,
      likePlace,
      birth,
      gender,
      likeGame,
      salt,
    });
    return createAccountData;
  };

  // 유저 id 찾기
  findUserAccountId = async (id) => {
    const findUserAccountData = await Users.findOne({
      id : id,
    });
    return findUserAccountData;
  };

  // 유저 nickname 찾기
  findUserAccountNick = async (nickname) => {
    const findUserAccountData = await Users.findOne({
      nickname : nickname,
    });
    return findUserAccountData;
  };

  // 유저 정보 조회 by 아이디와 닉네임을 위한 함수
  findUserAccount = async (id, nickname) => {
    // findOne로 id, nickname으로 이루어진 정보가 있는지 확인
    const findUserAccountData = await Users.findOne({
      id : id, nickname : nickname,
    });
    return findUserAccountData;
  };

  // 로그인을 위한 함수
  login = async (id) => {
    // findOne으로 email이 있는지 확인
    const loginData = await Users.findOne({ id : id });
    return loginData;
  };

  // refreshToken 업데이트 하는 함수
  updateToken = async (id, refresh_token) => {
    const updateTokenData = await Users.updateOne(
      { id: id },
      {$set: { refresh_token: refresh_token }}
    );
    return updateTokenData;
  };

  // 회원 정보 확인하기
  findUserData = async (id) => {
    const findUserData = await Users.findOne({
      attributes: ["nickname", "likeGame", "birth", "gender", "likePlace"],
      where: { id },
    });
    return findUserData;
  };

  // 회원 정보 변경하기
  updateUserData = async (
    id,
    nickname,
    password,
    address,
    likePlace,
    birth,
    gender,
    likeGame
  ) => {
    const updateUserData = await Users.update(
      {
        address: address,
        likePlace: likePlace,
        birth: birth,
        gender: gender,
        likeGame: likeGame,
      },
      { where: { id: id, nickname, password } }
    );
    return updateUserData;
  };

  // 회원 탈퇴
  deleteUserData = async (userId) => {
    await Comments.destroy({ where: { userId } });
    await Posts.destroy({ where: { userId } });
    const deleteUserData = await Users.destroy({ where: { userId } });
    return deleteUserData;
  };

}

module.exports = UsersRepository;
