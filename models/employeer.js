const mongoose = require("mongoose");
const emplrSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
});

module.exports = mongoose.model("Employer", emplrSchema);