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
    if (myToken == "jwt expired" || myToken == undefined) {
      res.status(419).json({message : "access_token_expired", code : 419})

      
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