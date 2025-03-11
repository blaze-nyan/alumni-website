const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    mediaId: {
      type: String,
      required: true,
      unique: true,
    },
    dataType: {
      type: String,
      required: true,
    },
    base64data: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Media", MediaSchema);
