import mongoose, { type Document, Schema } from "mongoose"

export interface IMedia extends Document {
  mediaId: string
  dataType: string
  base64data: string
  createdAt: Date
  updatedAt: Date
}

const MediaSchema = new Schema<IMedia>(
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
  },
)

export default mongoose.model<IMedia>("Media", MediaSchema)

