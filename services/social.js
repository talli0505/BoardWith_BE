require("dotenv").config();
const axios = require("axios");
const jwt = require("jsonwebtoken");
const SocialRepository = require('../repositories/social')

const GOOGLE_GRANT_TYPE = "authorization_code";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URI;

const KAKAO_GRANT_TYPE = "authorization_code";
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URL = process.env.KAKAO_REDIRECT_URL;

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_REDIRECT_URL = process.env.NAVER_REDIRECT_URL;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const NAVER_STATE = process.env.NAVER_STATE;

class SocialService {
    socialRepository = new SocialRepository();

    isGoogle = async (code) => {
        const {data} = await axios.post(
            `https://oauth2.googleapis.com/token?code=${code}&client_id=${GOOGLE_CLIENT_ID}&client_secret=${GOOGLE_CLIENT_SECRET}&redirect_uri=${GOOGLE_REDIRECT_URL}&grant_type=${GOOGLE_GRANT_TYPE}`,
            {
                headers: {"content-type": "application/x-www-form-urlencoded"},
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
        return userInfo.id
    }


    isKakao = async (code) => {
        const {data} = await axios.post(
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
        return kakaoUser.data.id
    }


    isNaver = async (code) => {
        const {data} = await axios.post(
            `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${code}&state=${NAVER_STATE}`,
            {
                headers: {
                    "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                },
            }
        );

        let access_token = data.access_token;

        const naverUser = await axios("https://openapi.naver.com/v1/nid/me", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                },
            });
        return naverUser.data.id
    }


    createUser = async (userId, nickName, myPlace, age, gender, likeGame, admin) => {
        const isSameNickname = await this.socialRepository.findUserAccountNick(nickName);

        // 유저 nickname 중복 검사
        if (isSameNickname) {
            const err = new Error(`UserService Error`);
            err.status = 409;
            err.message = "이미 가입된 닉네임이 존재합니다.";
            throw err;
        }

        const createUser = await this.socialRepository.createUser(userId, nickName, myPlace, age, gender, likeGame, admin);
        return createUser;
    }

    findUser = async (userId) => {
        const findUser = await this.socialRepository.findUser(userId)
        return findUser;
    }

    updateRefresh = async (userId, refresh_token) => {
        const updateRefresh = await this.socialRepository.updateRefresh(userId, refresh_token);
        return updateRefresh;
    }

    accessToken = async (userId) => {
        const accessToken = jwt.sign(
            {userId: userId},
            process.env.DB_SECRET_KEY,
            {
                expiresIn: "5m",
            }
        );
        return accessToken;
    }

    refreshToken = async () => {
        const refreshToken = jwt.sign({}, process.env.DB_SECRET_KEY, {
            expiresIn: "2h",
        });
        return refreshToken;
    }
}

module.exports = SocialService;