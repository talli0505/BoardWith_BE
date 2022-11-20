const Users  = require("../schema/users");   
const Posts = require("../schema/posts"); 
const Comments = require("../schema/comments"); 
const bookmark = require("../schema/bookmark");

class UsersRepository {
  // 회원가입을 위한 함수
  signUp = async (
    userId,
    nickName,
    password,
    address,
    myPlace,
    birth,
    gender,
    likeGame,
    introduce,
    admin
  ) => {
    // create로 회원가입
    const createAccountData = await Users.create({
      userId,
      nickName,
      password,
      address,
      myPlace,
      birth,
      gender,
      likeGame,
      introduce,
      admin
    });
    await bookmark.create({nickName})
    return createAccountData;
  };

  // 유저 id 찾기
  findUserAccountId = async (userId) => {
    const findUserAccountData = await Users.findOne({
      userId : userId,
    });
    return findUserAccountData;
  };

  // 유저 nickname 찾기
  findUserAccountNick = async (nickName) => {
    const findUserAccountData = await Users.findOne({
      nickName : nickName,
    });
    return findUserAccountData;
  };

  // 유저 정보 조회 by 아이디와 닉네임을 위한 함수
  findUserAccount = async (userId, nickName) => {
    // findOne로 id, nickName 이루어진 정보가 있는지 확인
    const findUserAccountData = await Users.findOne({
      userId : userId, nickName : nickName,
    });
    return findUserAccountData;
  };

  // 로그인을 위한 함수
  login = async (userId) => {
    // findOne으로 email이 있는지 확인
    const loginData = await Users.findOne({ userId : userId });
    return loginData;
  };

  // refreshToken 업데이트 하는 함수
  updateToken = async (userId, refresh_token) => {
    const updateTokenData = await Users.updateOne(
      { userId: userId },
      {$set: { refresh_token: refresh_token }}
    );
    return updateTokenData;
  };

  // 회원 정보 확인하기
  findUserData = async (userId) => {
    const findUserData = await Users.findOne({userId:userId});
    return {
      userId : findUserData.userId,
      nickName : findUserData.nickName,
      likeGame : findUserData.likeGame,
      address : findUserData.address,
      birth : findUserData.birth,
      gender : findUserData.gender,
      myPlace : findUserData.myPlace,
      introduce : findUserData.introduce,
      userAvater : findUserData.userAvater,
      point : findUserData.point,
      visible : findUserData.visible
    };
  };

  // 회원 정보 변경하기
  updateUserData = async (
    userId,
    nickName,
    password,
    address,
    myPlace,
    birth,
    gender,
    likeGame,
    introduce,
    userAvater,
    point
  ) => {
    const updateUserData = await Users.updateOne(
      { userId : userId, nickName : nickName },
      {$set:
        {address: address,
        myPlace: myPlace,
        birth: birth,
        gender: gender,
        likeGame: likeGame,
        introduce : introduce,
        userAvater : userAvater,
        point: point}
      }
    );
    return updateUserData;
  };

  // 회원 탈퇴
  deleteUserData = async (nickName) => {
    await Comments.deleteMany({ nickName : nickName });
    await Posts.deleteMany({ nickName : nickName });
    const deleteUserData = await Users.deleteOne({ nickName : nickName });
    return deleteUserData;
  };

  // 회원 성별 공개 여부
  visibleGender = async (userId) => {
    const visibleGender = await Users.findOne({userId : userId})
    if(visibleGender.visible) {
      await Users.updateOne(
        {userId : userId},
        {$set:
          {visible:false}
        }
      )
      } else {
        await Users.updateOne(
          {userId : userId},
          {$set:
            {visible:true}
          }
        )
      }
    }

  // 다른 유저 정보를 보기
  lookOtherUser = async (nickName) => {
    const lookOtherUser = await Users.findOne({nickName : nickName})
    return {
      nickName : lookOtherUser.nickName,
      likeGame : lookOtherUser.likeGame,
      birth : lookOtherUser.birth,
      gender : lookOtherUser.gender,
      myPlace : lookOtherUser.myPlace,
      introduce : lookOtherUser.introduce,
      userAvater : lookOtherUser.userAvater,
      visible : lookOtherUser.visible,
      point : lookOtherUser.point
    };
  }  
};

module.exports = UsersRepository; 
