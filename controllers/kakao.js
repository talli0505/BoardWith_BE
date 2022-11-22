// const Acess_ = require('../models/access_token');
require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const Users = require("../schema/users");

// 순서
// 1. 프론트에게 인가코드 받기
// 2. 받은 인가코드를 백이 kakao쪽에 token요청
// 3. token받은 걸로 유저 정보 체크 후 DB에 저장
// 4. DB에 저장 후 token을 다시 만들어서 프론트에게 보내기

// token을 전역으로 받기 위한 것
let acess_token = "";
// let refresh_token = "";

const KAKAO_GRANT_TYPE = "authorization_code";
const REST_API_KEY = process.env.client_id;
const KAKAO_REDIRECT_URL = process.env.KAKAO_REDIRECT_URL;

async function kakao_callback(req, res, next) {
  try {
    // 프론에게 인가코드 받기
    const {
      code,
      nickName,
      address,
      myPlace,
      age,
      gender,
      likeGame
    } = req.body;

    // 회원가입에 필요한 내용 싹다 넣기 -> kakao에 있는 schema를 users로 변경
    // console.log(nickName)
    // console.log(address)
    console.log('인가 코드' + code);
    try {
      const { data } = await axios.post(
        `https://kauth.kakao.com/oauth/token?grant_type=${KAKAO_GRANT_TYPE}&client_id=${REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URL}&code=${code}`,
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );
      // console.log(data)
      acess_token = data.access_token;
      // console.log(token)

      // token을 카카오 쪽에 보내서 정보 요청 및 받기
      const kakaoUser = await axios("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${acess_token}`,
        },
      });

      const findKakaoUser = await Users.findOne({ userId: kakaoUser.data.id });
      if (!findKakaoUser) {
        // 받은 데이터를 가지고 유저 정보를 DB에 저장
        const aaaaa = await Users.create({
          userId: kakaoUser.data.id,
          nickName: nickName,
          address: address,
          myPlace: myPlace,
          age: age,
          gender: gender,
          likeGame: likeGame
        });
        console.log(aaaaa)
      }

      // 프론트에게 전달
      const accessToken = jwt.sign(
        { userId: kakaoUser.data.id },
        process.env.DB_SECRET_KEY,
        {
          expiresIn: "15m",
        }
      );
      res.status(200).json({ accessToken: `Bearer ${accessToken}` });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      errorMessage: error.message,
      message: "에러가 발생했습니다.",
    });
    // console.log('error =' + err);
    console.log(message.err);
  }
}

module.exports = { kakao_callback };
