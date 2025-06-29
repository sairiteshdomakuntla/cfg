const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    studentId:  { type: Schema.Types.ObjectId, required: true, ref: "Student" }, // <-- ObjectId reference
    date:       { type: Date, required: true },
    parent:     { type: String, required: true, trim: true },
    educator:   { type: String, required: true, trim: true },
    improvement:{ type: String, required: true, trim: true },
    conclusion: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);