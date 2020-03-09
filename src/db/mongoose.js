const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
})


// const me = new User({
//     name:"Deepika   ",
    
//     DidSmoke:true,
//     email:"tammana@gmail.com   ",
//     password:"Tammana123"
// })
// me.save().then(()=>
// {
//   console.log(me)
// }).catch((error)=>
// {
//     console.log("Error",error)
// })