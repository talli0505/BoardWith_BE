const express = require("express");
const app = express();
const routes = require("./routes");
// const mongoose = require('mongoose')
// const redis = require("redis")

const swaggerFile = require("./swagger-output");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const connect = require("./schema");
connect();

app.use(express.json());
app.use(cors({
origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
}));

app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, { explorer: true })
);

app.use("/", routes);

// const initRedis = () => redis.createClient();

// const initMongo = async() => {
//   await mongoose.connect('mongodb+srv://test:sparta@cluster0.h0u5sld.mongodb.net/?retryWrites=true&w=majority', { userNewUrlParser:true }, (error) => {
//     if(error) {
//       console.log('mongodb connect error', error)
//     } else {
//       console.log('mongodb connect success')
//     }
//   })
// }

// const main = () =>{
//   initMongo().then(() => {
//     const redisClient = initRedis();
//     const server = initExpress(redisClient);
//     const webSocket = require("./socket");
//     webSocket(server);
//   })
// }
// main();

const port = 3000;
app.listen(port, () => {
  console.log(`${port}번 포트로 열렸습니다`);
});