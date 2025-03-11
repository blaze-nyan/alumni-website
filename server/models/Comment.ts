import mongoose, { type Document, Schema } from "mongoose"

export interface IComment extends Document {
  content: string
  author: mongoose.Types.ObjectId
  story: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    story: {
      type: Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IComment>("Comment", CommentSchema)

