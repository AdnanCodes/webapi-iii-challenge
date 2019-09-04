const express = require("express");
const usersRouter = require("./users/userRouter");

const server = express();
server.use(express.json());
server.use("/users", usersRouter);
server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {}

module.exports = server;
