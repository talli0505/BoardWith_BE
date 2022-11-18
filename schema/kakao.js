const mongoose = require('mongoose');
const KakaoSchema = new mongoose.Schema({
  id : {
    type : String,
  },
  nickname: {
    type: String,
  },
  age_range: {
    type: String,
  },
  gender : {
    type: String,
  }
});
const User = mongoose.model('Kakao', KakaoSchema);
module.exports = User;