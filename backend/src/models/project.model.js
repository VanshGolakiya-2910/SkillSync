import mongoose from "mongoose";
const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: { type: String, required: true },

    projectPhotos: [{ type: String }],

    projectVideo: { type: String },

    tags: [{ type: String, trim: true, lowercase: true }],

    techStack: [{ type: String, trim: true, lowercase: true }],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      index: true,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);