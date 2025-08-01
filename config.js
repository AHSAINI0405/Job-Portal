const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
const connect=mongoose.connect('mongodb://127.0.0.1:27017/jobportaldb',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
connect.then(()=>
    console.log("Database connected"))
.catch(()=>{
    console.log("Database Not connected")
})
module.exports=connect;