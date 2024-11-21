const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: "User", 
  },
  otp: {
    type: String,
    required: [true, "OTP is required"],
  },
  expiresAt: {
    type: Date,
    required: [true, "Expiration time is required"],
    default: () => Date.now() + 10 * 60 * 1000, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;
