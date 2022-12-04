require("dotenv").config();
const helmet = require('helmet')
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const routes = require("./routes");
const socket = require('./socket')
socket(server)

const swaggerFile = require("./swagger-output");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const connect = require("./schema");
connect();


app.use(helmet());
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

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`${port}번 포트로 열렸습니다`);
});