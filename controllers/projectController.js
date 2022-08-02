const Project = require("../models/Project");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// @desc    Create new project
// @route   POST /api/v1/projects
// @access  Private
const createProject = async (req, res) => {
  req.body.user = req.user.userId;

  const project = await Project.create(req.body);

  res.status(StatusCodes.CREATED).json({ project });
};

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Private
const getAllProjects = async (req, res) => {
  const projects = await Project.find({});

  res.status(StatusCodes.OK).json({ projects, count: projects.length });
};

// @desc    Get single project
// @route   GET /api/v1/projects/:id
// @access  Private
const getSingleProject = async (req, res) => {
  const { id: projectId } = req.params;

  const project = await Project.findOne({ _id: projectId });

  if (!project) {
    throw new CustomError.NotFoundError(`No project with id : ${projectId}`);
  }

  res.status(StatusCodes.OK).json({ project });
};

// @desc    Update single project
// @route   PATCH /api/v1/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  const { id: projectId } = req.params;

  const project = await Project.findOneAndUpdate({ _id: projectId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!ticket) {
    throw new CustomError.NotFoundError(`No project with id : ${projectId}`);
  }

  res.status(StatusCodes.OK).json({ project });
};

module.exports = {
  createProject,
  getAllProjects,
  getSingleProject,
  updateProject,
};
