import mongoose,{Schema} from "mongoose";

const projectSchema = new Schema(
  {
    
    title: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      unique: true,
    },
    description: { type: String , required : true},
    projectPhotos: [{ type: String }],
    tags: [{ type: String, required: true, trim: true, lowercase: true }],
    projectVideo : {type : String},
    techStack: [{ type: String }], 
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);


export const Project = mongoose.model("Project", projectSchema)