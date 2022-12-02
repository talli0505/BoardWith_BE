// const Acess_ = require('../models/access_token');
require("dotenv").config();
const SocialService = require("../services/social");

// 순서
// 1. 프론트에게 인가코드 받기
// 2. 받은 인가코드를 백이 kakao쪽에 token요청
// 3. token받은 걸로 유저 정보 체크 후 DB에 저장
// 4. DB에 저장 후 token을 다시 만들어서 프론트에게 보내기

class SoicalController {
  socialService = new SocialService();

  isGoogle = async (req, res, next) => {
    try {
      // 프론에게 인가코드 받기
      const { code } = req.body;
      // console.log("인가 코드" + code);

      const isGoogle = await this.socialService.isGoogle(code);

      const findGoogleUser = await this.socialService.findUser(isGoogle);
      if (!findGoogleUser) {
        res.status(200).json({ userId: isGoogle });
      } else {
        const accessToken = await this.socialService.accessToken(isGoogle)
        const refresh_token = await this.socialService.refreshToken()

        // refreshtoken DB에 업데이트
        await this.socialService.updateRefresh(isGoogle, refresh_token);

        res.status(201).json({
          accessToken: `Bearer ${accessToken}`,
          refresh_token: `Bearer ${refresh_token}`,
        });
      }
    } catch (err) {
      res.status(400).send({
        success: false,
        errorMessage: err.message,
        message: "에러가 발생했습니다.",
      });
    }
  };

  google_callback = async (req, res, next) => {
    try {
      // 프론에게 인가코드 받기
      const { userId, nickName, myPlace, age, gender, likeGame } = req.body;

      try {
        await this.socialService.createUser(
          userId,
          nickName,
          myPlace,
          age,
          gender,
          likeGame
        );

        const accessToken = await this.socialService.accessToken(userId);
        const refresh_token = await this.socialService.refreshToken();

        await this.socialService.updateRefresh(userId, refresh_token);

        res.status(201).json({
          accessToken: `Bearer ${accessToken}`,
          refresh_token: `Bearer ${refresh_token}`,
        });
      } catch (error) {
        console.log(error);
        res.status(409).json({message : error.message, statusCode : error.status});
      }
    } catch (err) {
      res.status(400).send({
        success: false,
        errorMessage: err.message,
        message: "에러가 발생했습니다.",
      });
    }
  };

  isKakao = async (req, res, next) => {
    try {
      // 프론에게 인가코드 받기
      const { code } = req.body;

      // console.log('인가 코드' + code);
      try {
        const isKakao = await this.socialService.isKakao(code)

        const findKakaoUser = await this.socialService.findUser(
          isKakao
        );
        if (!findKakaoUser) {
          res.status(200).json({ userId: isKakao });
        } else {
          const accessToken = await this.socialService.accessToken(isKakao);
          const refresh_token = await this.socialService.refreshToken();

          // refreshtoken DB에 업데이트
          await this.socialService.updateRefresh(isKakao, refresh_token);

          res.status(201).json({
            accessToken: `Bearer ${accessToken}`,
            refresh_token: `Bearer ${refresh_token}`,
          });
        }
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    } catch (err) {
      res.status(400).send({
        success: false,
        errorMessage: err.message,
        message: "에러가 발생했습니다.",
      });
    }
  };

  kakao_callback = async (req, res, next) => {
    try {
      // 프론에게 인가코드 받기
      const { userId, nickName, myPlace, age, gender, likeGame } = req.body;

      // 회원가입에 필요한 내용 싹다 넣기 -> kakao에 있는 schema를 users로 변경
      // console.log(nickName)
      // console.log(address)
      try {
        await this.socialService.createUser(
          userId,
          nickName,
          myPlace,
          age,
          gender,
          likeGame
        );

        const accessToken = await this.socialService.accessToken(userId);
        const refresh_token = await this.socialService.refreshToken();

        await this.socialService.updateRefresh(userId, refresh_token);

        res.status(201).json({
          accessToken: `Bearer ${accessToken}`,
          refresh_token: `Bearer ${refresh_token}`,
        });
      } catch (error) {
        console.log(error);
        res.status(409).json({message : error.message, statusCode : error.status});
      }
    } catch (err) {
      res.status(400).send({
        success: false,
        errorMessage: err.message,
        message: "에러가 발생했습니다.",
      });
    }
  };

  isNaver = async (req, res, next) => {
    try {
      // 프론에게 인가코드 받기
      const { code } = req.body;

      // console.log('인가 코드' + code);
      try {
        const isNaver = await this.socialService.isNaver(code)

        const findNaverUser = await this.socialService.findUser(
            isNaver
        );
        if (!findNaverUser) {
          res.status(200).json({ userId: isNaver });
        } else {
          const accessToken = await this.socialService.accessToken(isNaver);
          const refresh_token = await this.socialService.refreshToken();

          // refreshtoken DB에 업데이트
          await this.socialService.updateRefresh(isNaver, refresh_token);

          res.status(201).json({
            accessToken: `Bearer ${accessToken}`,
            refresh_token: `Bearer ${refresh_token}`,
          });
        }
      } catch (error) {
        console.log(error);
        res.send(error);
      }
    } catch (err) {
      res.status(400).send({
        success: false,
        errorMessage: err.message,
        message: "에러가 발생했습니다.",
      });
    }
  };

  naver_callback = async (req, res, next) => {
    try {
      // 프론에게 인가코드 받기
      const { userId, nickName, myPlace, age, gender, likeGame } = req.body;

      // 회원가입에 필요한 내용 싹다 넣기 -> kakao에 있는 schema를 users로 변경
      // console.log(nickName)
      // console.log(address)
      try {
        await this.socialService.createUser(
            userId,
            nickName,
            myPlace,
            age,
            gender,
            likeGame
        );

        const accessToken = await this.socialService.accessToken(userId);
        const refresh_token = await this.socialService.refreshToken();

        await this.socialService.updateRefresh(userId, refresh_token);

        res.status(201).json({
          accessToken: `Bearer ${accessToken}`,
          refresh_token: `Bearer ${refresh_token}`,
        });
      } catch (error) {
        console.log(error);
        res.status(409).json({message : error.message, statusCode : error.status});
      }
    } catch (err) {
      res.status(400).send({
        success: false,
        errorMessage: err.message,
        message: "에러가 발생했습니다.",
      });
    }
  };
}

module.exports = SoicalController;
