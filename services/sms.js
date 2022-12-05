require("dotenv").config();
const axios = require('axios');
const CryptoJS = require('crypto-js');
const SmsRepository = require("../repositories/sms");

class SmsService {
  smsRepository = new SmsRepository();

  send = async (phoneNumber) => {
    const date = Date.now().toString();
    const uri = process.env.SENS_SERVICE_ID
    const secretKey = process.env.SENS_SERVICE_SECRET_KEY
    const accessKey = process.env.SENS_SERVICE_ACCESS_KEY
    const method = 'POST';
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
    const url2 = `/sms/v2/services/${uri}/messages`;

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);

    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);

    const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;

    await this.smsRepository.UpdateCode(phoneNumber, verifyCode);

    axios({
      method: method,
      json: true,
      url: url,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-timestamp': date,
        'x-ncp-apigw-signature-v2': signature,
      },
      data: {
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: process.env.SENS_MY_NUM,
        content: `[Board With] 인증번호 [${verifyCode}]를 입력해주세요.`,
        messages: [
          {
            to: `${phoneNumber}`,
          },
        ],
      }
    }).then(function (res) {
      console.log('response', res.data, res['data']);
      return verifyCode;
    })
      .catch((err) => {
        if (err.res == undefined) {
          return verifyCode;
        }
      })
      return verifyCode;
  }

  verify = async (phoneNumber, verifyCode) => {
    const findValue = await this.smsRepository.findValue(phoneNumber, verifyCode);
    if (!findValue) {
      const err = new Error(`SmsService Error`);
      err.status = 401;
      err.message = "인증번호가 틀렸습니다.";
      throw err;
    } else if (findValue.verifyCode !== verifyCode) {
      const err = new Error(`SmsService Error`);
      err.status = 401;
      err.message = "인증번호가 틀렸습니다.";
      throw err;
    } else {
      return 'success';
    }
  }

  sendID = async (phoneNumber) => {
    const date = Date.now().toString();
    const uri = process.env.SENS_SERVICE_ID
    const secretKey = process.env.SENS_SERVICE_SECRET_KEY
    const accessKey = process.env.SENS_SERVICE_ACCESS_KEY
    const method = 'POST';
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
    const url2 = `/sms/v2/services/${uri}/messages`;

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);

    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);

    const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;

    const findPhone = await this.smsRepository.findPhone(phoneNumber)
    if (!findPhone) {
      const err = new Error(`SmsService Error`);
      err.status = 401;
      err.message = "일치하는 핸드폰 번호가 없습니다.";
      throw err;
    }

    await this.smsRepository.UpdateCode(phoneNumber, verifyCode);

    axios({
      method: method,
      json: true,
      url: url,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-timestamp': date,
        'x-ncp-apigw-signature-v2': signature,
      },
      data: {
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: process.env.SENS_MY_NUM,
        content: `[Board With] 인증번호 [${verifyCode}]를 입력해주세요.`,
        messages: [
          {
            to: `${phoneNumber}`,
          },
        ],
      }
    }).then(function (res) {
      console.log('response', res.data, res['data']);
      return verifyCode;
    })
      .catch((err) => {
        if (err.res == undefined) {
          return verifyCode;
        }
      })
      return verifyCode;
  }

  verifyID = async (phoneNumber, verifyCode) => {
    const findValue = await this.smsRepository.findValue(phoneNumber, verifyCode);
    if (!findValue) {
      const err = new Error(`SmsService Error`);
      err.status = 401;
      err.message = "인증번호가 틀렸습니다.";
      throw err;
    } else if (findValue.verifyCode !== verifyCode) {
      const err = new Error(`SmsService Error`);
      err.status = 401;
      err.message = "인증번호가 틀렸습니다.";
      throw err;
    } else {
      return findValue.userId;
    }
  }

  sendPW = async (phoneNumber, userId) => {
    const date = Date.now().toString();
    const uri = process.env.SENS_SERVICE_ID
    const secretKey = process.env.SENS_SERVICE_SECRET_KEY
    const accessKey = process.env.SENS_SERVICE_ACCESS_KEY
    const method = 'POST';
    const space = " ";
    const newLine = "\n";
    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
    const url2 = `/sms/v2/services/${uri}/messages`;

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(date);
    hmac.update(newLine);
    hmac.update(accessKey);

    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);

    const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;

    const findPass = await this.smsRepository.findPass(phoneNumber, userId)
    if (!findPass) {
      const err = new Error(`SmsService Error`);
      err.status = 401;
      err.message = "핸드폰 번호 혹은 아이디가 일치하지 않습니다.";
      throw err;
    }

    await this.smsRepository.UpdateCode(phoneNumber, verifyCode);

    axios({
      method: method,
      json: true,
      url: url,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-timestamp': date,
        'x-ncp-apigw-signature-v2': signature,
      },
      data: {
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: process.env.SENS_MY_NUM,
        content: `[Board With] 인증번호 [${verifyCode}]를 입력해주세요.`,
        messages: [
          {
            to: `${phoneNumber}`,
          },
        ],
      }
    }).then(function (res) {
      console.log('response', res.data, res['data']);
      return verifyCode;
    })
      .catch((err) => {
        if (err.res == undefined) {
          return verifyCode;
        }
      })
      return verifyCode;
  }
}

module.exports = SmsService;