require("dotenv").config();
const axios = require('axios');
const CryptoJS = require('crypto-js');
const SmsService = require('../services/sms');

class SMS {
  smsService = new SmsService();

send = async(req, res, next) => {
  try {
    const phoneNumber = req.body.phoneNumber;
  
    const send = await this.smsService.send(phoneNumber);

    res.status(201).json({code: 201, message: "본인인증 문자 발송 성공", verifyCode: send})
  } catch(err) {
    res.status(401||err.status).json({statusCode : err.status, message: err.message})
  }
};

// 회원가입 시 인증 번호 확인
verify = async(req, res, next) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    const verifyCode = req.body.verifyCode;

    const verify = await this.smsService.verify(phoneNumber, verifyCode)
  
    res.status(201).json(verify)
  } catch(err) {
    res.status(401).json({statusCode : err.status, message: err.message})
  }

};

// 아이디 찾기 할때 사용하는 인증번호 보내기
sendID = async (req, res, next) => {
  try {
    const phoneNumber = req.body.phoneNumber;
  
    const sendID = await this.smsService.sendID(phoneNumber);

    res.status(201).json({code: 201, message: "본인인증 문자 발송 성공", verifyCode: sendID})
  } catch(err) {
    res.status(401).json({statusCode : err.status, message: err.message})
  }
};

// 아이디 찾을 때 인증번호 받은거 확인
verifyID = async (req, res, next) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    const verifyCode = req.body.verifyCode;
  
    const verifyID = await this.smsService.verifyID(phoneNumber, verifyCode)
    
    res.status(201).json(verifyID)
  } catch(err) {
    res.status(401).json({statusCode : err.status, message: err.message})
  }
};

// 비밀번호 찾기 할때 사용하는 인증번호 보내기
sendPW = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const phoneNumber = req.body.phoneNumber;

    const sendPW = await this.smsService.sendPW(phoneNumber, userId)

    res.status(201).json({code: 201, message: "본인인증 문자 발송 성공", verifyCode: sendPW})
  } catch(err) {
    res.status(401).json({statusCode : err.status, message: err.message})
  }
};
}

module.exports = SMS;
// module.exports = { send, verify, sendID, verifyID, sendPW };

