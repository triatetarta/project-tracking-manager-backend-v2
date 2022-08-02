const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

// @desc    Create ticket comment
// @route   POST /api/v1/comments
// @access  Private
const createComment = async (req, res) => {
  const { ticket: ticketId } = req.body;

  const isValidTicket = await Ticket.findOne({ _id: ticketId });

  if (!isValidTicket) {
    throw new CustomError.NotFoundError(`No ticket with id : ${ticketId}`);
  }

  req.body.user = req.user.userId;

  const comment = await Comment.create(req.body);

  res.status(StatusCodes.CREATED).json({ comment });
};

// @desc    Get ticket comments
// @route   GET /api/v1/comments
// @access  Private
const getAllComments = async (req, res) => {
  const comments = await Comment.find({}).populate({
    path: "ticket",
    select: "name company price",
  });

  res.status(StatusCodes.OK).json({ comments, count: comments.length });
};

// @desc    Get single comment
// @route   GET /api/v1/comments/:id
// @access  Private
const getSingleComment = async (req, res) => {
  const { id: commentId } = req.params;

  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) {
    throw new CustomError.NotFoundError(`No comment with id ${commentId}`);
  }

  res.status(StatusCodes.OK).json({ comment });
};

// @desc    Update single comment
// @route   PATCH /api/v1/comments/:id
// @access  Private
const updateComment = async (req, res) => {
  const { id: commentId } = req.params;
  const { comment: commentText } = req.body;

  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) {
    throw new CustomError.NotFoundError(`No comment with id ${commentId}`);
  }

  checkPermissions(req.user, comment.user);

  comment.comment = commentText;

  await comment.save();

  res.status(StatusCodes.OK).json({ comment });
};

// @desc    Delete single comment
// @route   DELETE /api/v1/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  const { id: commentId } = req.params;

  const comment = await Comment.findOne({ _id: commentId });

  if (!comment) {
    throw new CustomError.NotFoundError(`No comment with id ${commentId}`);
  }

  checkPermissions(req.user, comment.user);

  await comment.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! Comment removed" });
};

// @desc    Get single ticket comments
// @route   GET /api/v1/tickets/:id/comments
// @access  Private
const getSingleTicketComments = async (req, res) => {
  const { id: ticketId } = req.params;

  const comments = await Comment.find({ ticket: ticketId });

  res.status(StatusCodes.OK).json({ comments, count: comments.length });
};

module.exports = {
  createComment,
  getAllComments,
  getSingleComment,
  updateComment,
  deleteComment,
  getSingleTicketComments,
};
