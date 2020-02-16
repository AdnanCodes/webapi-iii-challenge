const express = require("express");
const usersRouter = require("./users/userRouter");

const server = express();
server.use(express.json());

function logger(req, res, next) {
  console.log(`${new Date().toISOString()} ${req.method} to ${req.url}`);
  next();
}
server.use(logger);
server.use("/users", usersRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
module.exports = server;
