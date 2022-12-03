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

//인증번호 생성
const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;

class SMS {
  // 회원가입시 사용하는 인증 번호
send = async(req, res, next) => {
  const phoneNumber = req.body.phoneNumber;

  Cache.del(phoneNumber);

  Cache.put(phoneNumber, verifyCode.toString());

  const smsRes = await axios({
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
      console.log('response',res.data, res['data']);
      res.status(201).json({isSuccess: true, code: 202, message: "본인인증 문자 발송 성공", verifyCode : verifyCode });
    })
    .catch((err) => {
      if(err.res == undefined){
        res.status(201).json({isSuccess: true, code: 202, message: "본인인증 문자 발송 성공", verifyCode : verifyCode });
      }
    })
};

// 회원가입 시 인증 번호 확인
verify = (req, res, next) => {
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
sendID = async(req, res, next) => {
    const phoneNumber = req.body.phoneNumber;
    try {
      const findPhoneNum = await Users.findOne({phoneNumber : phoneNumber})
      if(!findPhoneNum) {
        throw new Error("핸드폰 번호가 일치하지 않습니다.")
      } 
    
      Cache.del(phoneNumber);
    
      Cache.put(phoneNumber, verifyCode.toString());
    
      const smsRes = await axios({
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
          console.log('response',res.data, res['data']);
          res.status(201).json({isSuccess: true, code: 202, message: "본인인증 문자 발송 성공", verifyCode : verifyCode });
        })
        .catch((err) => {
          if(err.res == undefined){
            res.json({isSuccess: true, code: 202, message: "본인인증 문자 발송 성공", verifyCode : verifyCode });
          }
        })
    } catch(e) {
      res.status(400).json({message : e.message})
    }

};

// 아이디 찾을 때 인증번호 받은거 확인
verifyID = async(req, res, next) => {
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
sendPW = async(req, res, next) => {
  const userId = req.body.userId;
  const phoneNumber = req.body.phoneNumber;
  try {
    const findPhoneNum = await Users.findOne({phoneNumber : phoneNumber, userId : userId})
    if(!findPhoneNum) {
      throw new Error("핸드폰 번호 혹은 아이디가 일치하지 않습니다.")
    } 
  
    Cache.del(phoneNumber);
  
    Cache.put(phoneNumber, verifyCode.toString());
  
    const smsRes = await axios({
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
        console.log('response',res.data, res['data']);
        res.status(201).json({isSuccess: true, code: 202, message: "본인인증 문자 발송 성공", verifyCode : verifyCode });
      })
      .catch((err) => {
        if(err.res == undefined){
          res.json({isSuccess: true, code: 202, message: "본인인증 문자 발송 성공", verifyCode : verifyCode });
        }
      })
  } catch(e) {
    res.status(400).json({message : e.message})
  }

};
}

module.exports = SMS;

