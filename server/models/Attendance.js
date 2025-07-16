const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    checkInTime: { type: String }, // HH:mm
    checkOutTime: { type: String }, // HH:mm
    status: {
      type: String,
      enum: ["Present", "Half-day", "Late", "Absent"],
      default: "Present",
    },
    workingHours: { type: Number, default: 0 },
    method: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
