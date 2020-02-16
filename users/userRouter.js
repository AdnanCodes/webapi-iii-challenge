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
router.post("/:id/posts", validatePost, (req, res) => {
  Posts.insert(req.body)
    .then(posts => {
      if (posts) {
        res.status(201).json(posts);
      } else {
        res.status(404).json({ errorMessage: "User with that ID isn't found" });
      }
    })
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

//Get User by ID
router.get("/:id", validateUserId, (req, res) => {
  Users.getById(req.params.id)
    .then(user => res.status(200).json(user))
    .catch(() =>
      res.status(500).json({ errorMessage: "Unexpected error with Database" })
    );
});

//Gets all posts for specific user
router.get("/:id/posts", validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
    .then(posts => {
      if (posts.length > 0) {
        res.status(200).json(posts);
      } else {
        res.status(200).json({ userPosts: "There are no posts on this user" });
      }
    })
    .catch(() =>
      res.status(500).json({ errorMessage: "Couldn't retrieve users Posts" })
    );
});

router.delete("/:id", validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(user => res.status(200).json({ recordsDeleted: `${user}` }))
    .catch(() =>
      res
        .status(500)
        .json({ errorMessage: "Couldn't delete user from the database" })
    );
});

router.put("/:id", [validateUserId, validateUser], (req, res) => {
  Users.update(req.params.id, req.body)
    .then(user => res.status(202).json(user))
    .catch(() =>
      res.status(500).json({ errorMessage: "User couldn't be updated" })
    );
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id).then(user => {
    if (user) {
      req.user = user;
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
  } else if (req.body.user_id === undefined) {
    res.status(400).json({ errorMessage: "Missing a user_id" });
  } else {
    next();
  }
}

module.exports = router;
