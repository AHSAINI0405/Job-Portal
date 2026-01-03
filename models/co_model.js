const mongoose=require('mongoose');
const companySchema=new mongoose.Schema({
logo:{
    type:String,
     default: "default.jpg"
},
companyname:{
    type:String,
    required:true
},
companytype:
{
    type:String,
    required:true
},
mobile: {
  type: String,
  required: true,
  match: /^[0-9]{10}$/
},
email:{
    type:String,
    required:true,
    lowercase: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email']
},
address:{
    type:String,
    required:true
},
city:{
    type:String,
    required:true
},
state:{
    type:String,
    required:true
},
bio:{
    type:String,
    required:true,
    maxlength: 1000
},
socialprofile:{
    linkedin:String,
    facebook:String,
    twitter:String
},
createdAt: {
    type: Date,
    default: Date.now
  },
    employerId:{
        type:String,
        required:true    
    }
})
module.exports=mongoose.model("companyprofile",companySchema);