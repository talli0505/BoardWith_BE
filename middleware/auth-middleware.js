require("dotenv").config();
const jwt = require("jsonwebtoken");
const Users = require("../schema/users");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;

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
    if (myToken == "jwt expired") {

      // accessToken을 디코드
      const userInfo = jwt.decode(tokenValue, process.env.DB_SECRET_KEY);

      // 디코드 한 값에서 이메일 가져와서 선언
      const id = userInfo.id;

      let refresh_token;

      // DB에 있는 refresh 토큰 찾아오기
      Users.findOne({ where: {id} }).then((u) => {
        refresh_token = u.refresh_token;

      // 가지고있는 refreshToken 확인
      const myRefreshToken = verifyToken(refresh_token);

      // 만약 만료가 되었을때
      if (myRefreshToken == "jwt expired") {
        res.send({ errorMessage: "로그인이 필요합니다." });
      } else {
        const myNewToken = jwt.sign(
          { id: id },
          process.env.DB_SECRET_KEY,
          {
            expiresIn: "15m",
          }
        );
        res.send({ message: "new access Token", myNewToken : `Bearer ${myNewToken}` });
        }
      });
    } else {
      const {id} = jwt.verify(tokenValue, process.env.DB_SECRET_KEY);
      const user = await Users.findOne({id : id})
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