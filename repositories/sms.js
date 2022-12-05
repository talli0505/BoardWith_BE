const Users = require("../schema/users")

class SmsRepository {
  UpdateCode = async(phoneNumber, verifyCode) => {
    const UpdateCode = await Users.updateOne({phoneNumber : phoneNumber},{$set : {verifyCode : verifyCode}})
    return UpdateCode;
  }

  findPhone = async(phoneNumber) => {
    const findPhone = await Users.findOne({phoneNumber : phoneNumber});
    return findPhone;
  }

  findPass = async(phoneNumber, userId) => {
    const findPass = await Users.findOne({phoneNumber : phoneNumber, userId : userId});
    return findPass;
  }

  findValue = async(phoneNumber, verifyCode) => {
    const findValue = await Users.findOne({phoneNumber : phoneNumber, verifyCode : verifyCode})
    return findValue;
  }
}

module.exports = SmsRepository;