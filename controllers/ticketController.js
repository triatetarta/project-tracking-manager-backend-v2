const Ticket = require("../models/Ticket");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// @desc    Create new ticket
// @route   POST /api/v1/tickets
// @access  Private
const createTicket = async (req, res) => {
  req.body.user = req.user.userId;

  const ticket = await Ticket.create(req.body);

  res.status(StatusCodes.CREATED).json({ ticket });
};

// @desc    Get all tickets
// @route   GET /api/v1/tickets
// @access  Private
const getAllTickets = async (req, res) => {
  const tickets = await Ticket.find({});

  res.status(StatusCodes.OK).json({ tickets, count: tickets.length });
};

// @desc    Get single ticket
// @route   GET /api/v1/tickets/:id
// @access  Private
const getSingleTicket = async (req, res) => {
  const { id: ticketId } = req.params;

  const ticket = await Ticket.findOne({ _id: ticketId }).populate("comments");

  if (!ticket) {
    throw new CustomError.NotFoundError(`No ticket with id : ${ticketId}`);
  }

  res.status(StatusCodes.OK).json({ ticket });
};

// @desc    Update single ticket
// @route   PATCH /api/v1/tickets/:id
// @access  Private
const updateTicket = async (req, res) => {
  const { id: ticketId } = req.params;

  const ticket = await Ticket.findOneAndUpdate({ _id: ticketId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!ticket) {
    throw new CustomError.NotFoundError(`No ticket with id : ${ticketId}`);
  }

  res.status(StatusCodes.OK).json({ ticket });
};

// @desc    Delete single ticket
// @route   DELETE /api/v1/tickets/:id
// @access  Private
const deleteTicket = async (req, res) => {
  const { id: ticketId } = req.params;

  const ticket = await Ticket.findOne({ _id: ticketId });

  if (!ticket) {
    throw new CustomError.NotFoundError(`No ticket with id : ${ticketId}`);
  }

  await ticket.remove();

  res.status(StatusCodes.OK).json({ msg: "Success! Ticket removed." });
};

module.exports = {
  createTicket,
  getAllTickets,
  getSingleTicket,
  updateTicket,
  deleteTicket,
};
