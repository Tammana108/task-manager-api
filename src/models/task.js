const mongoose = require('mongoose')
const validator = require('validator')

const bcrypt = require('bcryptjs')
//const userSchema = new mongoose.Schema()
    // userSchema.pre('save',async function(next){
    //     const user=this
    //     if(user.isModified('password')){
    //     user.password= await bcrypt.hash(user.password,8)
    //     }
    // next()
    // })
   // const User = mongoose.model('User',)
   const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        default:"NoTask"
  },
  completed:{
       type:Boolean,
        default:"false"
  },
  owner:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      ref:'User'
  }

   },{
       timestamps:true
   })
const Task = mongoose.model('Task',taskSchema)

module.exports=Task
