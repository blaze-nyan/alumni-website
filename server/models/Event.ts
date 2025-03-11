import mongoose, { type Document, Schema } from "mongoose"

export interface IEvent extends Document {
  title: string
  description: string
  author: mongoose.Types.ObjectId
  mediaIds: string[]
  isDeleted: boolean
  calendar: {
    date: Date
    location: string
  }
  attendees: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<IEvent>(
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
      type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IEvent>("Event", EventSchema)

