// 메모리 캐시를 사용하는 부분 -> 서버가 다른경우도 체크해봐야함

require("dotenv").config();
const axios = require('axios');
const Cache = require('memory-cache');
const CryptoJS = require('crypto-js');
const Users  = require("../schema/users");  

const date = Date.now().toString();
const uri = process.env.SENS_SERVICE_ID
const secretKey = process.env.SENS_SERVICE_SECRET_KEY
const accessKey = process.env.SENS_SERVICE_ACCESS_KEY
const method = 'POST';
const space = " ";
const newLine = "\n";
const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
const url2 = `/sms/v2/services/${uri}/messages`;

const  hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

hmac.update(method);
hmac.update(space);
hmac.update(url2);
hmac.update(newLine);
hmac.update(date);
hmac.update(newLine);
hmac.update(accessKey);

const hash = hmac.finalize();
const signature = hash.toString(CryptoJS.enc.Base64);

// 회원가입시 사용하는 인증 번호
function send(req, res, next) {
  const phoneNumber = req.body.phoneNumber;

  Cache.del(phoneNumber);

  //인증번호 생성
  const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;

  Cache.put(phoneNumber, verifyCode.toString());

  axios({
    method: method,
    json: true,
    url: url,
    headers: {
      'Content-Type': 'application/json',
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
    })
  .then(function (res) {
    console.log('response',res.data, res['data']);
    res.json({isSuccess: true, code: 202, message: "본인인증 문자 발송 성공", verifyCode : verifyCode });
  })
  .catch((err) => {
    if(err.res == undefined){
      res.json({isSuccess: true, code: 200, message: "본인인증 문자 발송 성공", verifyCode : verifyCode });
    }
    else res.json({isSuccess: true, code: 204, message: "본인인증 문자 발송에 문제가 있습니다.", result: err.res });
  });
};

// 회원가입 시 인증 번호 확인
async function verify(req, res, next) {
  const phoneNumber = req.body.phoneNumber;
  const verifyCode = req.body.verifyCode;

  const CacheData = Cache.get(phoneNumber);

  if (!CacheData) {
    return res.send('fail');
  } else if (CacheData !== verifyCode) {
    return res.send('fail');
  } else {
    Cache.del(phoneNumber);
    return res.send('success');
  }
};

// 아이디 찾기 할때 사용하는 인증번호 보내기
async function sendID(req, res, next) {
    const phoneNumber = req.body.phoneNumber;
    try {
      const findPhoneNum = await Users.findOne({phoneNumber : phoneNumber})
      if(!findPhoneNum) {
        throw new Error("핸드폰 번호가 일치하지 않습니다.")
      } 
    
      Cache.del(phoneNumber);
    
      //인증번호 생성
      const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    
      Cache.put(phoneNumber, verifyCode.toString());
    
      axios({
        method: method,
        json: true,
        url: url,
        headers: {
          'Content-Type': 'application/json',
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
        })
      .then(function (res) {
        console.log('response',res.data, res['data']);
        res.json({isSuccess: true, code: 202, message: "본인인증 문자 발송 성공", result: res.data });
      })
      .catch((err) => {
        if(err.res == undefined){
          res.json({isSuccess: true, code: 200, message: "본인인증 문자 발송 성공", result: res.data });
        }
        else res.json({isSuccess: true, code: 204, message: "본인인증 문자 발송에 문제가 있습니다.", result: err.res });
      });
    } catch(e) {
      res.status(400).json({message : e.message})
    }

};

// 아이디 찾을 때 인증번호 받은거 확인
async function verifyID(req, res, next) {
  const phoneNumber = req.body.phoneNumber;
  const verifyCode = req.body.verifyCode;

    const CacheData = Cache.get(phoneNumber);

    if (!CacheData) {
      return res.send('fail');
    } else if (CacheData !== verifyCode) {
      return res.send('fail');
    } else {
      const findId = await Users.findOne({phoneNumber : phoneNumber})
      Cache.del(phoneNumber);
      return res.send({findId : findId.userId});
    }
};

// 비밀번호 찾기 할때 사용하는 인증번호 보내기
async function sendPW(req, res, next) {
  const userId = req.body.userId;
  const phoneNumber = req.body.phoneNumber;
  try {
    const findPhoneNum = await Users.findOne({phoneNumber : phoneNumber, userId : userId})
    if(!findPhoneNum) {
      throw new Error("핸드폰 번호 혹은 아이디가 일치하지 않습니다.")
    } 
  
    Cache.del(phoneNumber);
  
    //인증번호 생성
    const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  
    Cache.put(phoneNumber, verifyCode.toString());
  
    axios({
      method: method,
      json: true,
      url: url,
      headers: {
        'Content-Type': 'application/json',
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
      })
    .then(function (res) {
      console.log('response',res.data, res['data']);
      res.json({isSuccess: true, code: 202, message: "본인인증 문자 발송 성공", result: res.data });
    })
    .catch((err) => {
      res.json({isSuccess: false, code: 204, message: "본인인증 문자 발송에 문제가 있습니다.", result: err.res });
    });
  } catch(e) {
    res.status(400).json({message : e.message})
  }

};

module.exports = {send, verify, sendID, verifyID, sendPW}