const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
  title: {
     type:String, 
    required: true },
  description: {
    type: [String],
    required: true,
  },
  education: {
    type: [String],
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  vacancy: {
    type: Number,
    required: true,
  },
    salary:{
      type:String,
      
    },
  lastDate: {
    type: Date,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: String,
    required:true
  },
  companyname:{
    type:String,
    required:true
  }
});
module.exports = mongoose.model("jobs", jobSchema);
