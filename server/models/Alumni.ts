import mongoose, { type Document, Schema } from "mongoose"

export interface IAlumni extends Document {
  user: mongoose.Types.ObjectId
  friends: mongoose.Types.ObjectId[]
  status: string
  createdAt: Date
  updatedAt: Date
}

const AlumniSchema = new Schema<IAlumni>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IAlumni>("Alumni", AlumniSchema)

