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

const GOOGLE_GRANT_TYPE = "authorization_code";
const REST_API_KEY = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URI;

async function isGoogle(req, res, next) {
  try {
    // 프론에게 인가코드 받기
    const { code } = req.body;
    console.log("인가 코드" + code);

    const {data} = await axios.post(`https://oauth2.googleapis.com/token?code=${code}&client_id=${REST_API_KEY}&client_secret=${GOOGLE_CLIENT_SECRET}&redirect_uri=${GOOGLE_REDIRECT_URL}&grant_type=${GOOGLE_GRANT_TYPE}`, 
    {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    })

    // console.log("aaaaaaaaaaaaa  " + data)
    // console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee " + data.access_token)

    let access_token = data.access_token

    const userInfo = await axios(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((el) => {
        return el.data
      })

    const findGoogleUser = await Users.findOne({ userId : userInfo.id })
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
    await Users.updateOne(
        { userId: userInfo.id },
        { $set: { refresh_token: refresh_token } }
      );

      res.status(201).json({
        accessToken: `Bearer ${accessToken}`,
        refresh_token : `Bearer ${refresh_token}`,
      });
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

async function google_callback(req, res, next) {
  try {
    // 프론에게 인가코드 받기
    const { userId, nickName, address, myPlace, age, gender, likeGame } =
      req.body;

    // 회원가입에 필요한 내용 싹다 넣기 -> kakao에 있는 schema를 users로 변경
    // console.log(nickName)
    // console.log(address)
    try {
      const aaaaa = await Users.create({
        userId: userId,
        nickName: nickName,
        address: address,
        myPlace: myPlace,
        age: age,
        gender: gender,
        likeGame: likeGame,
      });

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

      await Users.updateOne(
        { userId: userId },
        { $set: { refresh_token: refresh_token } }
      );

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
      errorMessage: error.message,
      message: "에러가 발생했습니다.",
    });
    // console.log('error =' + err);
    console.log(message.err);
  }
}

module.exports = { isGoogle, google_callback };
