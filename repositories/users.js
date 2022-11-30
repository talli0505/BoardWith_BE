const Users = require("../schema/users");
const Posts = require("../schema/posts");
const Comments = require("../schema/comments");
const bookmark = require("../schema/bookmark");
const moment = require('moment')
const date = moment().format('YYYY-MM-DD HH:mm:ss')

class UsersRepository {
  // 회원가입을 위한 함수
  
  signUp = async (
    userId, nickName, password, phoneNumber, address, myPlace, age, gender, likeGame, admin) => {
    // create로 회원가입
    const createAccountData = await Users.create({userId,nickName,password,phoneNumber,address,myPlace,age,gender,likeGame,admin,createdAt: date,updatedAt: date
    });
    await bookmark.create({ nickName });
    return createAccountData;
  };

  // 유저 id 찾기
  findUserAccountId = async (userId) => {
    const findUserAccountData = await Users.findOne({
      userId: userId,
    });
    return findUserAccountData;
  };

  // 유저 nickname 찾기
  findUserAccountNick = async (nickName) => {
    const findUserAccountData = await Users.findOne({
      nickName: nickName,
    });
    return findUserAccountData;
  };

  // 유저 정보 조회 by 아이디와 닉네임을 위한 함수
  findUserAccount = async (userId) => {
    // findOne로 id, nickName 이루어진 정보가 있는지 확인
    const findUserAccountData = await Users.findOne({
      userId: userId,
    });
    return findUserAccountData;
  };

  // 로그인을 위한 함수
  login = async (userId) => {
    // findOne으로 email이 있는지 확인
    const loginData = await Users.findOne({ userId: userId });
    return loginData;
  };

  // refreshToken 업데이트 하는 함수
  updateToken = async (userId, refresh_token) => {
    const updateTokenData = await Users.updateOne(
      { userId: userId },
      { $set: { refresh_token: refresh_token } }
    );
    return updateTokenData;
  };

  // 회원 정보 확인하기
  findUserData = async (userId, nickName) => {
    const findUserData = await Users.findOne({
      userId: userId,
      nickName,
    }).select([
      "-_id",
      "-password",
      "-address",
      "-createdAt",
      "-updatedAt",
      "-refresh_token",
      "-phoneNumber",
      "-__v",
    ]);
    return findUserData;
  };

  // 회원 정보 변경하기
  updateUserData = async (
    userId,
    nickName,
    address,
    myPlace,
    age,
    gender,
    likeGame,
    userAvater,
    point,
    totalPoint,
    visible
  ) => {
    const updateUserData = await Users.updateOne(
      { userId: userId, nickName: nickName },
      {
        $set: {
          address: address,
          myPlace: myPlace,
          age: age,
          gender: gender,
          likeGame: likeGame,
          userAvater: userAvater,
          point: point,
          totalPoint: totalPoint,
          visible: visible,
        },
      }
    );
    return updateUserData;
  };

  // 회원 탈퇴
  deleteUserData = async (nickName) => {
    await Comments.deleteMany({ nickName: nickName });
    await Posts.deleteMany({ nickName: nickName });
    const deleteUserData = await Users.deleteOne({ nickName: nickName });
    return deleteUserData;
  };

  // 다른 유저 정보를 보기
  lookOtherUser = async (nickName) => {
    const lookOtherUser = await Users.findOne({ nickName: nickName }).select([
      "-_id",
      "-userId",
      "-password",
      "-address",
      "-createdAt",
      "-updatedAt",
      "-refresh_token",
      "-phoneNumber",
      "-__v",
    ]);
    return lookOtherUser;
  };

  // 비밀번호 변경
  changePW = async (userId, password) => {
    const changePW = await Users.updateOne(
      { userId: userId },
      { $set: { password: password } }
    );
    return changePW;
  };

  loginCheck = async(userId) => {
    await Users.updateOne({userId:userId}, {$inc:{point:100, totalPoint:100}})
    await Users.updateOne({userId,userId}, {$set:{loginCheck:false}})

    return
  }

  refreshT = async(refresh_token) => {
    const refreshT = await Users.findOne({refresh_token : refresh_token})
    return refreshT
  }

  //북마크
  findBookmark = async(nickName) => {
    const findBookmark = await Users.findOne({nickName:nickName})
    return findBookmark
  }

  pushBookmark = async(postId, nickName) => {
    const pushBookmark = await Users.updateOne({nickName:nickName},{$push:{bookmark: postId}})
    return pushBookmark
  }

  pullBookmark = async(postId, nickName) => {
    const pullBookmark = await Users.updateOne({nickName:nickName}, {$pull:{bookmark:postId}})
    return pullBookmark
  }

  getBookmark = async(nickName) => {
    const getBookmark = await Users.find({nickName:nickName})
    return getBookmark
  }

  AllgetBookmark = async(postId) => {
    //console.log("postId", postId)
    const AllgetBookmark = await Posts.find({_id:postId});
    //console.log("repo-AllgetBookmark", AllgetBookmark)
    return AllgetBookmark
  }
}

module.exports = UsersRepository;
