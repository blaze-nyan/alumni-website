import mongoose, { type Document, Schema } from "mongoose"

export interface IStory extends Document {
  title: string
  description: string
  author: mongoose.Types.ObjectId
  mediaIds: string[]
  isDeleted: boolean
  likes: mongoose.Types.ObjectId[]
  comments: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const StorySchema = new Schema<IStory>(
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
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IStory>("Story", StorySchema)

