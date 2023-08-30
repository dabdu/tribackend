const mongoose = require("mongoose");

const flightTicketSchema = mongoose.Schema(
  {
    ticketDetails: {
      type: String,
      required: true,
    },
    ticketRefID: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("flightTicket", flightTicketSchema);
