// const Acess_ = require('../models/access_token');
require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const SocialService = require("../services/social");

// 순서
// 1. 프론트에게 인가코드 받기
// 2. 받은 인가코드를 백이 kakao쪽에 token요청
// 3. token받은 걸로 유저 정보 체크 후 DB에 저장
// 4. DB에 저장 후 token을 다시 만들어서 프론트에게 보내기

const GOOGLE_GRANT_TYPE = "authorization_code";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URI;

const KAKAO_GRANT_TYPE = "authorization_code";
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URL = process.env.KAKAO_REDIRECT_URL;

class SoicalController {
  socialService = new SocialService();

  isGoogle = async (req, res, next) => {
    try {
      // 프론에게 인가코드 받기
      const { code } = req.body;
      // console.log("인가 코드" + code);

      const { data } = await axios.post(
        `https://oauth2.googleapis.com/token?code=${code}&client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&redirect_uri=${GOOGLE_REDIRECT_URL}&grant_type=${GOOGLE_GRANT_TYPE}`,
        {
          headers: { "content-type": "application/x-www-form-urlencoded" },
        }
      );

      let access_token = data.access_token;

      const userInfo = await axios(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      ).then((el) => {
        return el.data;
      });

      const findGoogleUser = await this.socialService.findUser(userInfo.id);
      if (!findGoogleUser) {
        res.status(200).json({ userId: userInfo.id });
      } else {
        const accessToken = jwt.sign(
          { userId: userInfo.id },
          process.env.DB_SECRET_KEY,
          {
            expiresIn: "5m",
          }
        );

        // refreshtoken 생성
        const refresh_token = jwt.sign({}, process.env.DB_SECRET_KEY, {
          expiresIn: "2h",
        });

        // refreshtoken DB에 업데이트
        await this.socialService.updateRefresh(userInfo.id, refresh_token);

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

        // 프론트에게 전달
        const accessToken = jwt.sign(
          { userId: userId },
          process.env.DB_SECRET_KEY,
          {
            expiresIn: "5m",
          }
        );

        // refreshtoken 생성
        const refresh_token = jwt.sign({}, process.env.DB_SECRET_KEY, {
          expiresIn: "2h",
        });

        await this.socialService.updateRefresh(userId, refresh_token);

        res.status(201).json({
          accessToken: `Bearer ${accessToken}`,
          refresh_token: `Bearer ${refresh_token}`,
        });
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

  isKakao = async (req, res, next) => {
    try {
      // 프론에게 인가코드 받기
      const { code } = req.body;

      // console.log('인가 코드' + code);
      try {
        const { data } = await axios.post(
          `https://kauth.kakao.com/oauth/token?grant_type=${KAKAO_GRANT_TYPE}&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URL}&code=${code}`,
          {
            headers: {
              "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          }
        );

        let acess_token = data.access_token;

        // token을 카카오 쪽에 보내서 정보 요청 및 받기
        const kakaoUser = await axios("https://kapi.kakao.com/v2/user/me", {
          headers: {
            Authorization: `Bearer ${acess_token}`,
          },
        });

        const findKakaoUser = await this.socialService.findUser(
          kakaoUser.data.id
        );
        if (!findKakaoUser) {
          res.status(200).json({ userId: kakaoUser.data.id });
        } else {
          const accessToken = jwt.sign(
            { userId: kakaoUser.data.id },
            process.env.DB_SECRET_KEY,
            {
              expiresIn: "5m",
            }
          );

          // refreshtoken 생성
          const refresh_token = jwt.sign({}, process.env.DB_SECRET_KEY, {
            expiresIn: "2h",
          });

          // refreshtoken DB에 업데이트
          await this.socialService.updateRefresh(
            kakaoUser.data.id,
            refresh_token
          );

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

        // 프론트에게 전달
        const accessToken = jwt.sign(
          { userId: userId },
          process.env.DB_SECRET_KEY,
          {
            expiresIn: "15m",
          }
        );

        // refreshtoken 생성
        const refresh_token = jwt.sign({}, process.env.DB_SECRET_KEY, {
          expiresIn: "1d",
        });

        await this.socialService.updateRefresh(userId, refresh_token);

        res.status(201).json({
          accessToken: `Bearer ${accessToken}`,
          refresh_token: `Bearer ${refresh_token}`,
        });
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
}

module.exports = SoicalController;
