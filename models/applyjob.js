const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  currentprof: {
    type: String,
    required: true
  },
  current_ctc: {
  type: Number,
  min: [0, 'Current CTC cannot be negative'],
  required: true
  },
  exp_ctc: {
      type: Number,
  min: [0, 'Expected CTC cannot be negative'],
  required: true
  },
  companyName:{
    type:String,
    required:true
  },
  jobtype: {
    type: String,
    required: true
  },
  job_id: {
    type: String,
    required: true
  },
  job_title:{
    type:String,
    required:true
  },
  userid:{
    type:String,
    required:true
  },
  application_date: {
    type: Date,
    default: Date.now()
  },
  lastDate:{
    type:Date,
    required:true
  },
  resume:{
    type:String,
    required:true
  },
  status: {
    type: String,
    enum: ["Pending", "Shortlisted", "Rejected", "Selected"],
    default: "Pending"
  }
});

module.exports = mongoose.model("Candidate", candidateSchema);
