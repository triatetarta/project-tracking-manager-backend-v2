const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
} = require("../controllers/projectController");

router.route("/").post(authenticateUser, createProject).get(getAllProjects);

router
  .route("/:id")
  .get(authenticateUser, getSingleProject)
  .patch(authenticateUser, updateProject);

module.exports = router;
