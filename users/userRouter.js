const express = require("express");

const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

//Creates a New user on DB
router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => res.status(201).json(user))
    .catch(() =>
      res
        .status(500)
        .json({ errorMessage: "Couldn't store the user in the database" })
    );
});

//Creates a new post for specific user
router.post("/:id/posts", validateUserId, (req, res) => {
  console.log(req.body);
  Posts.insert(req.body)
    .then(posts => res.status(201).json(posts))
    .catch(() =>
      res.status(500).json({
        error: "There was an error while saving the posts to the database"
      })
    );
});

//Gets all users in DB
router.get("/", (req, res) => {
  Users.get()
    .then(user => res.status(200).json(user))
    .catch(() => res.status(500).json({ error: "Couldn't retrieve Users" }));
});

router.get("/:id", (req, res) => {});

router.get("/:id/posts", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.put("/:id", (req, res) => {});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id).then(user => {
    if (user) {
      req.user = user;
      console.log("user in validate", user);
      next();
    } else {
      res.status(400).json({ message: "invalid user id" });
    }
  });
}

function validateUser(req, res, next) {
  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }
  if (isEmpty(req.body)) {
    res.status(400).json({ errorMessage: "Missing a body" });
  } else if (req.body.name === undefined) {
    res.status(400).json({ errorMessage: "Missing a name Field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }
  if (isEmpty(req.body)) {
    res.status(400).json({ errorMessage: "Missing a body" });
  } else if (req.body.text === undefined) {
    res.status(400).json({ errorMessage: "Missing a Text Field" });
  } else {
    next();
  }
}

module.exports = router;
