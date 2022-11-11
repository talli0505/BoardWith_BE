const UsersRepository = require("../repositories/users");   
const crypto = require("crypto");
const CHECK_PASSWORD = /^[a-zA-Z0-9]{4,30}$/;
const CHECK_ID = /^[a-zA-Z0-9]{4,20}$/;

class UserService {
  // 새 인스턴스 생성
  usersRepository = new UsersRepository();

  // 회원가입 찾기위한 함수
  signUp = async (
    userId,
    nickName,
    password,
    confirm,
    address,
    myPlace,
    birth,
    gender,
    likeGame,
    admin
  ) => {
    // usersService 안에 있는 findUserAccount 함수를 이용해서 선언
    const isSameId = await this.usersRepository.findUserAccountId(userId);
    const isSameNickname = await this.usersRepository.findUserAccountNick(
      nickName
    );

    // 유저 id 중복 검사
    if (isSameId) {
      const err = new Error(`UserService Error`);
      err.status = 409;
      err.message = "이미 가입된 아이디가 존재합니다.";
      throw err;
    }

    // 유저 nickname 중복 검사
    if (isSameNickname) {
      const err = new Error(`UserService Error`);
      err.status = 409;
      err.message = "이미 가입된 닉네임이 존재합니다.";
      throw err;
    }

    //아이디가 최소 9자리 아닐 경우
    if (!CHECK_ID.test(userId)) {
      const err = new Error(`UserService Error`);
      err.status = 403;
      err.message = "아이디는 최소 9자리 이상으로 해주세요.";
      throw err;
    }

    // 비밀번호 최소치 안맞을 경우
    if (!CHECK_PASSWORD.test(password)) {
      const err = new Error(`UserService Error`);
      err.status = 403;
      err.message = "비밀번호는 최소 4자리수를 넘겨주세요";
      throw err;
    }

    // 비밀번호와 비밀번호 확인이 안맞을 경우
    if (password !== confirm) {
      const err = new Error(`UserService Error`);
      err.status = 403;
      err.message = "비밀번호와 확인 비밀번호가 일치하지 않습니다.";
      throw err;
    }

    let salt = crypto.randomBytes(32).toString("base64");
    // 반복 횟수 한번 늘려보자
    let Password = crypto
      .pbkdf2Sync(password, salt, 100, 32, "sha512")
      .toString("base64");

    // userRepository안에 있는 createAccount 함수를 이용하여 선언 (salt도 넣어야함)
    const createAccountData = await this.usersRepository.signUp(
      userId,
      nickName,
      Password,
      address,
      myPlace,
      birth,
      gender,
      likeGame,
      salt,
      admin
    );

    return createAccountData;
  };

  // 로그인 찾기위한 함수
  login = async (userId, password) => {
    // userRepository안에 있는 login 함수를 이용하여 선언
    const loginData = await this.usersRepository.login(userId);

    if (!loginData) {
      const err = new Error(`UserService Error`);
      err.status = 403;
      err.message = "아이디를 확인해주세요.";
      throw err;
    }

    let salt = loginData.salt;
    let Password = crypto
      .pbkdf2Sync(password, salt, 100, 32, "sha512")
      .toString("base64");

    if (Password !== loginData.password) {
      const err = new Error(`UserService Error`);
      err.status = 403;
      err.message = "패스워드를 확인해주세요.";
      throw err;
    }

    return { loginData };
  };

  // refreshToken 업데이트 하는 함수
  updateToken = async (userId, refresh_token) => {
    // console.log(refresh_Token)
    await this.usersRepository.updateToken(userId, refresh_token);

    const findData = await this.usersRepository.findUserAccount(
      userId,
      refresh_token
    );

    return findData;
  };

  // nickname 불러오기
  getNickname = async (userId, password) => {
    const getNickname = await this.usersRepository.findUserAccount(
      userId,
      password
    );
    return getNickname;
  };

  // 회원 정보 불러오기
  findUserData = async (userId) => {
    const findUserData = await this.usersRepository.findUserData(userId);
    return findUserData;
  };

  // 회원 정보 업데이트
  updateUserData = async (
    userId,
    nickName,
    password,
    confirm,
    address,
    myPlace,
    birth,
    gender,
    likeGame
  ) => {
    // 비밀번호 안 적을 경우
    if (!password) {
      const err = new Error(`UserService Error`);
      err.status = 403;
      err.message = "비밀번호를 입력해주세요";
      throw err;
    }

    // 비밀번호와 비밀번호 확인이 안맞을 경우
    if (password !== confirm) {
      const err = new Error(`UserService Error`);
      err.status = 403;
      err.message = "비밀번호와 확인 비밀번호가 일치하지 않습니다.";
      throw err;
    }

    const findUserAccountId = await this.usersRepository.findUserAccountId(userId)

    if(address == "" ) {
      address = findUserAccountId.address
    }

    if(myPlace == "" ) {
      myPlace = findUserAccountId.myPlace
    }

    if(birth == "" ) {
      birth = findUserAccountId.birth
    }

    if(gender == "" ) {
      gender = findUserAccountId.gender
    }

    if(likeGame == "" ) {
      likeGame = findUserAccountId.likeGame
    }

    

    // 암호화 풀기 위해서 가져옴
    const loginData = await this.usersRepository.login(userId);

    let salt = loginData.salt;
    let Password = crypto
      .pbkdf2Sync(password, salt, 100, 32, "sha512")
      .toString("base64");

    const updateUserData = await this.usersRepository.updateUserData(
      userId,
      nickName,
      Password,
      address,
      myPlace,
      birth,
      gender,
      likeGame
    );
    return updateUserData;
  };

  // 회원 탈퇴
  deleteUserData = async (nickname) => {
    const deleteUserData = await this.usersRepository.deleteUserData(nickname);
    return deleteUserData;
  };
}

module.exports = UserService;
