const UsersService = require("../services/users");
const jwt = require("jsonwebtoken");

class UsersController {
  usersService = new UsersService();

  // 회원가입
  signUp = async (req, res, next) => {
    try {
      const {
        userId,
        nickName,
        password,
        confirm,
        phoneNumber,
        myPlace,
        age,
        gender,
        likeGame,
        admin
      } = req.body;

      await this.usersService.signUp(
          userId,
          nickName,
          password,
          confirm,
          phoneNumber,
          myPlace,
          age,
          gender,
          likeGame,
          admin
      );

      res
          .status(201)
          .json({ok: true, statusCode: 201, message: "회원가입성공"});
    } catch (err) {
      res
          .status(err.status || 400)
          .json({ok: 0, statusCode: err.status, err: err.message});
    }
  };

  //로그인
  login = async (req, res, next) => {
    try {
      const {userId, password} = req.body;

      // 유효성 검사
      const login = await this.usersService.login(userId, password);

      if (login === null)
        return res.status(404).send({
          ok: 0,
          statusCode: 404,
          errorMessage: "가입 정보를 찾을 수 없습니다",
        });

      await this.usersService.login(userId, password);

      const getNickname = await this.usersService.getNickname(userId, password);

      const accessToken = await this.usersService.accessToken(userId);

      const refresh_token = await this.usersService.refreshToken();

      // refreshtoken DB에 업데이트
      await this.usersService.updateToken(userId, refresh_token);

      res.status(201).json({
        accessToken: `Bearer ${accessToken}`,
        refresh_token: `Bearer ${refresh_token}`,
        nickName: getNickname.nickName
      });
    } catch (err) {
      res.status(err.status || 400).json({
        ok: 0,
        statusCode: err.status,
        message: err.message || "로그인 실패",
      });
    }
  };

  findDupId = async (req, res, next) => {
    const { userId } = req.body;
    try {
      const findDupId = await this.usersService.findDupId(userId)
      res.status(201).json({findDupId : findDupId})
    } catch(err) {
      res.status(400).json({message : err.message, statusCode : err.status})
    }
    
  }

  findDupNick = async (req, res, next) => {
    const { nickName } = req.body;
    try {
      const findDupNick = await this.usersService.findDupId(nickName)
      res.status(201).json({findDupNick : findDupNick})
    } catch(err) {
      res.status(400).json({message : err.message, statusCode : err.status})
    }
  }

  // 회원 정보 찾기
  findUser = async (req, res, next) => {
    const {userId, nickName} = res.locals.user;
    const findUser = await this.usersService.findUserData(userId, nickName);

    //참여 예약한 모임
    const partyReserved = await this.usersService.partyReservedData(nickName);

    //참여 확정된 모임
    const partyGo = await this.usersService.partyGoData(nickName);

    res.status(200).json({findUser, partyReserved, partyGo});
  };

  // 회원 정보 변경
  updateUserData = async (req, res, next) => {
    try {
      const {userId, nickName} = res.locals.user;
      const {myPlace, age, gender, likeGame, userAvatar, point, totalPoint, visible, tutorial} =
          req.body;
      await this.usersService.updateUserData(
          userId,
          nickName,
          myPlace,
          age,
          gender,
          likeGame,
          userAvatar,
          point,
          totalPoint,
          visible,
          tutorial
      );

      const findUserData = await this.usersService.findUserData(userId, nickName)
      res.status(200).json({ok: 1, statusCode: 200, message: "수정 완료", findUserData : findUserData});
    } catch (err) {
      res.status(err.status || 400).json({
        ok: 0,
        statusCode: err.status,
        message: err.message || "수정 실패",
      });
    }
  };

  // 회원 탈퇴
  deleteUserData = async (req, res, next) => {
    try {
      const {nickName} = res.locals.user;
      await this.usersService.deleteUserData(nickName);
      res.status(200).json({ok: 1, statusCode: 200, message: "삭제 완료"});
    } catch (err) {
      res.status(err.status || 400).json({
        ok: 0,
        statusCode: err.status,
        message: err.message || "삭제 실패",
      });
    }
  };

  // 소켓 내용 꺼내오기
  updateSocket = async (req, res, nex) => {
    const {room} = req.params
    const updateSocket = await this.usersService.updateSocket(room);
    res.status(200).json({updateSocket: updateSocket});
  }

  // 다른 유저 정보를 보기
  lookOtherUser = async (req, res, next) => {
    const {nickName} = req.params;
    const lookOtherUser = await this.usersService.lookOtherUser(nickName);

    //참여 예약한 모임
    const partyReserved = await this.usersService.partyReservedData(nickName);

    //참여 확정된 모임
    const partyGo = await this.usersService.partyGoData(nickName);

    res.status(200).json({lookOtherUser: lookOtherUser, partyReserved, partyGo})
  }

  // 비밀번호 변경 하기 위한 것
  changePW = async (req, res, next) => {
    const {userId, password} = req.body;
    const changePW = await this.usersService.changePW(userId, password);
    res.status(200).json({message: "축하합니다 변경이 완료되었습니다."});
  }


  loginCheck = async (req, res, next) => {
    const {userId} = res.locals.user;
    await this.usersService.loginCheck(userId);
    res.status(200).json({message: "출석체크가 완료되었습니다"});
  }

  refreshT = async (req, res, next) => {
    const {refresh_token} = req.body;
    const [tokenType, tokenValue] = refresh_token.split(" ");
    const refreshT = await this.usersService.refreshT(tokenValue);

    const myRefreshToken = verifyToken(refreshT.refresh_token);
    // || myRefreshToken == undefined

    if (myRefreshToken == "jwt expired") {
      res.status(420).json({message: "로그인이 필요합니다.", code: 420});
    } else {
      const accessToken = await this.usersService.accessToken(refreshT.userId)

      res.send({accessToken: accessToken})
    }
  }

//북마크
  pushBookmark = async (req, res, next) => {
    const {postId} = req.body;
    const nickName = res.locals.user.nickName;
    await this.usersService.pushBookmark(postId, nickName)
    res.status(200).json({message: "북마크 처리 완료"})
  }

  getBookmark = async (req, res, next) => {
    try {
      const {nickName} = res.locals.user;
      const getBookmark = await this.usersService.getBookmark(nickName);
      res.status(200).json({data: getBookmark, message: "조회 완료"});
    } catch (err) {
      res.status(err.status || 400).json({statusCode: err.status, message: err.message})
    }
  }
}

module.exports = UsersController; 

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.DB_SECRET_KEY);
  } catch (error) {
    return error.message;
  }
}