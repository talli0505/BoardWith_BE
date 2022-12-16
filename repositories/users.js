const Users = require("../schema/users"); 
const Posts = require("../schema/posts");
const Comments = require("../schema/comments");
const bookmark = require("../schema/bookmark");
const moment = require('moment')
const date = moment().format('YYYY-MM-DD HH:mm:ss')

class UsersRepository {
  // 회원가입을 위한 함수
  
  signUp = async (
    userId, nickName, password, phoneNumber, myPlace, age, gender, likeGame, admin) => {
    // create로 회원가입
    const createAccountData = await Users.create({userId,nickName,password,phoneNumber,myPlace,age,gender,likeGame,admin, visible:"V", tutorial:false, createdAt: date,updatedAt: date
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
    myPlace,
    age,
    gender,
    likeGame,
    visible,
    tutorial
  ) => {
    await Users.updateOne(
      { userId: userId },
      {
        $set: {
          nickName : nickName,
          myPlace: myPlace,
          age: age,
          gender: gender,
          likeGame: likeGame,
          visible: visible,
          tutorial: tutorial
        },
      }
    );
    await Posts.updateMany(
      { userId: userId },
      {
        $set: {
          nickName : nickName
        },
      }
    );
    await Comments.updateMany(
      { userId: userId },
      {
        $set: {
          nickName : nickName
        },
      }
    );
    return;
  };

  // 회원 탈퇴
  deleteUserData = async (nickName) => {
    await Comments.deleteMany({ nickName: nickName });
    await Posts.deleteMany({ nickName: nickName });
    await bookmark.deleteMany({nickName : nickName});
    const deleteUserData = await Users.deleteOne({ nickName: nickName });
    return deleteUserData;
  };

  // 다른 유저 정보를 보기
  lookOtherUser = async (nickName) => {
    const lookOtherUser = await Users.findOne({ nickName: nickName }).select([
      "-_id",
      "-userId",
      "-password",
      "-createdAt",
      "-updatedAt",
      "-refresh_token",
      "-phoneNumber",
      "-__v",
    ]);
    return lookOtherUser;
  };

  // 정보 찾기 nick으로
  findUserNick = async (nickName) => {
    const findUserNick = await Users.findOne({nickName : nickName})
    return findUserNick;
  }

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
    await Users.updateOne({userId:userId}, {$set:{loginCheck:false}})

    return
  }

  refreshT = async(refreshToken) => {
    const refreshT = await Users.findOne({refresh_token : refreshToken})
    return refreshT;
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

  // 아바타 포인트 차감
  subPoint = async(userId, userAvatar) => {
    const subPoint = await Users.findOne({userId : userId})
    if(subPoint.point < 0) {
      await Users.updateOne({userId:userId}, {$set:{point: 0}})
      const err = new Error(`UserRepository Error`);
      err.status = 403;
      err.message = "포인트가 부족합니다.";
      throw err;
    }

    if(subPoint.userAvatar.Eye !== userAvatar.Eye) {
      await Users.updateOne({userId:userId}, {$inc:{point: -300}})
    }
    if(subPoint.userAvatar.Hair !== userAvatar.Hair) {
      await Users.updateOne({userId:userId}, {$inc:{point: -300}})
    }
    if(subPoint.userAvatar.Mouth !== userAvatar.Mouth ) {
      await Users.updateOne({userId:userId}, {$inc:{point: -300}})
    }
    if(subPoint.userAvatar.Back !== userAvatar.Back) {
      await Users.updateOne({userId:userId}, {$inc:{point: -300}})
    }

    await Users.updateOne({userId : userId}, {$set:{userAvatar : userAvatar}})
    const afterPoint = await Users.findOne({userId : userId})
    return afterPoint.point;
  }
}

module.exports = UsersRepository;