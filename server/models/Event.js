const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaIds: [
      {
        type: String,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    calendar: {
      date: {
        type: Date,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", EventSchema);
