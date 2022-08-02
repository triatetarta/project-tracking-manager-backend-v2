const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  createTicket,
  deleteTicket,
  getAllTickets,
  getSingleTicket,
  updateTicket,
} = require("../controllers/ticketController");

const { getSingleTicketComments } = require("../controllers/commentController");

router.route("/").post(authenticateUser, createTicket).get(getAllTickets);

router
  .route("/:id")
  .get(authenticateUser, getSingleTicket)
  .patch(authenticateUser, updateTicket)
  .delete(authenticateUser, deleteTicket);

router.route("/:id/comments").get(getSingleTicketComments);

module.exports = router;
