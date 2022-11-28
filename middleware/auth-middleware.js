require("dotenv").config();
const jwt = require("jsonwebtoken");
const Users = require("../schema/users");

module.exports = async (req, res, next) => {
  const { authorization, refresh } = req.headers;

  if (authorization == null) { 
    res.status(401).send({
      errorMessage: "로그인이 필요합니다.",
    });
    return;
  }

  const [tokenType, tokenValue] = authorization.split(" ");

  if (tokenType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인이 필요합니다.",
    });
    return;
  }

  try {
    // 가지고있는 accessToken 확인
    const myToken = verifyToken(tokenValue);

    // 만약 만료가 되었을때
    if (myToken == "jwt expired" || myToken == undefined) {

      // res.send({ errorMessage: "access 만료되었습니다." });

      // accessToken을 디코드
      const userInfo = jwt.decode(tokenValue, process.env.DB_SECRET_KEY);

      // 디코드 한 값에서 이메일 가져와서 선언
      const userId = userInfo.userId;

      let refresh_token;

      // DB에 있는 refresh 토큰 찾아오기
      await Users.findOne({ userId : userId}).then((u) => {
        refresh_token = u.refresh_token;

      // 가지고있는 refreshToken 확인
      const myRefreshToken = verifyToken(refresh_token);

      // 만약 만료가 되었을때
      if (myRefreshToken == "jwt expired") {
        res.send({ errorMessage: "로그인이 필요합니다." });
      } else {
        // 날려준 refresh토큰과 내가 db에 저장한 refresh 토큰이 같은지 확인 후에 access 토큰을 생성해줌
        if(refresh === `Bearer ${refresh_token}`) {
          const myNewToken = jwt.sign(
            { userId: userId },
            process.env.DB_SECRET_KEY,
            {
              expiresIn: "15m",
            }
          );
          res.send({ message: "new access Token", myNewToken : `Bearer ${myNewToken}` })
        } else {
          res.status(400).json({message : "refresh가 일치하지 않습니다."})
        }
        }
      });
    } else {
      const {userId} = jwt.verify(tokenValue, process.env.DB_SECRET_KEY);
      const user = await Users.findOne({userId : userId})
      res.locals.user = user;
      next();
    }
  } catch (err) {
    res.send({ errorMessage: err + " : 로그인이 필요합니다." });
  }
};

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.DB_SECRET_KEY);
  } catch (error) {
    return error.message;
  }
}