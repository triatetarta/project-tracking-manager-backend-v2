const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  createComment,
  getAllComments,
  getSingleComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

router
  .route("/")
  .post(authenticateUser, createComment)
  .get(authenticateUser, getAllComments);

router
  .route("/:id")
  .get(authenticateUser, getSingleComment)
  .patch(authenticateUser, updateComment)
  .delete(authenticateUser, deleteComment);

module.exports = router;
