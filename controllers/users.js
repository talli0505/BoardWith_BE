const UsersService = require("../services/users");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
        address,
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
        address,
        myPlace,
        age,
        gender,
        likeGame,
        admin
      );

      res
        .status(201)
        .json({ ok: true, statusCode: 201, message: "회원가입성공" });
    } catch (err) {
      res
        .status(err.status || 400)
        .json({ ok: 0, statusCode: err.status, err: err.message });
    }
  };

  //로그인
  login = async (req, res, next) => {
    try {
      const { userId, password } = req.body;

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

      // accesstoken 생성
      const accessToken = jwt.sign({ userId: userId }, process.env.DB_SECRET_KEY, {
        expiresIn: "365d",
      });

      // refreshtoken 생성
      const refresh_token = jwt.sign({}, process.env.DB_SECRET_KEY, {
        expiresIn: "1d",
      });

      // refreshtoken DB에 업데이트
      await this.usersService.updateToken(userId, refresh_token);

      res.status(201).json({
        accessToken: `Bearer ${accessToken}`,
        nickName : getNickname.nickName
      });
    } catch (err) {
      res.status(err.status || 400).json({
        ok: 0,
        statusCode: err.status,
        message: err.message || "로그인 실패",
      });
    }
  };

  // 회원 정보 찾기
  findUser = async (req, res, next) => {
    const { userId, nickName } = res.locals.user;
    const findUser = await this.usersService.findUserData(userId, nickName);

    //참여 예약한 모임
    const partyReserved = await this.usersService.partyReservedData(nickName);

    //참여 확정된 모임
    const partyGo = await this.usersService.partyGoData(nickName);

    res.status(200).json({ findUser, partyReserved, partyGo });
  };

  // 회원 정보 변경
  updateUserData = async (req, res, next) => {
    try {
      const { userId, nickName } = res.locals.user;
      const { address, myPlace, age, gender, likeGame, userAvater, point, totalPoint, visible } =
        req.body;
      await this.usersService.updateUserData(
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
        visible,
      );
      res.status(200).json({ ok: 1, statusCode: 200, message: "수정 완료", visible : visible });
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
      const { nickName } = res.locals.user;
      await this.usersService.deleteUserData(nickName);
      res.status(200).json({ ok: 1, statusCode: 200, message: "삭제 완료" });
    } catch(err) {
      res.status(err.status || 400).json({
        ok: 0,
        statusCode: err.status,
        message: err.message || "삭제 실패",
      });
    }
  };

  // 소켓 내용 꺼내오기
  updateSocket = async (req, res, nex) => {
    const { room } = req.params
    const updateSocket = await this.usersService.updateSocket(room);
    res.status(200).json({ updateSocket : updateSocket });
  }

  // 다른 유저 정보를 보기
  lookOtherUser = async(req, res, next) => {
    const {nickName} = req.params;
    const lookOtherUser = await this.usersService.lookOtherUser(nickName);
    res.status(200).json({lookOtherUser : lookOtherUser})
  }

  // 비밀번호 변경 하기 위한 것
  changePW = async(req, res, next) => {
    const {userId, password} = req.body;
    const changePW = await this.usersService.changePW(userId, password);
    res.status(200).json({message : "축하합니다 변경이 완료되었습니다."});
  }
}

module.exports = UsersController; 
