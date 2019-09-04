const express = require("express");

const Users = require("./userDb");

const router = express.Router();

router.post("/", validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => res.status(201).json(user))
    .catch(() =>
      res
        .status(500)
        .json({ errorMessage: "Couldn't store the user in the database" })
    );
});

router.post("/:id/posts", (req, res) => {});

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

function validateUserId(req, res, next) {}

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

function validatePost(req, res, next) {}

module.exports = router;
