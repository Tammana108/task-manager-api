express = require('express')
require('./db/mongoose')
const Task = require('./models/task')
const User = require('./models/user')
const UserRouter = require('./routers/users')
const UserRouter1 = require('./routers/tasks')
const app = express()
 const port = process.env.PORT
 app.use(express.json())
app.use(UserRouter)
app.use(UserRouter1)

app.listen(port,()=>
{
    console.log("server is up on port  "+port)
})
 //const multer = require('multer')
//  const upload = multer({
//      dest:'images',
//      limits:
//      {
//          fileSize:1000000
//      },
//      fileFilter(req,file,cb)
//      {
//          if(!file.originalname.match(/\.(doc|docx)$/))
//          {
//              return cb(new Error('Please upload the document file'))
//          }
//          cb(undefined,true)
//      }
//  })
//  app.post('/upload',upload.single('upload'),(req,res)=>
//  {
//      res.send()
//  })
// app.use((req,res,next)=>
// {
//     if(req.method==='GET'){
//   res.status(503).send("The site is under maintenence")
//     }
//     else{
//   next()
//     }
// })



// const main = async(req,res)=>{
//     // const task = await Task.findById('5e622c5913b9c0103c7daacd')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     const user = await User.findById('5e62156a1e23281ea0124df9')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()

// //const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')

// const myFunction=async()=>
// {
//    const token= jwt.sign({_id:'afgh457687'},'Thisismyfirstattempt',{expiresIn:'2 seconds'})
//    console.log(token)
//    const data = jwt.verify(token,'Thisismyfirstattempt')
//    console.log(data)
//     // const password = 'Tammana123%'
//     // const hashedpassword = await bcrypt.hash(password,8)
//     // console.log(password)
//     // console.log(hashedpassword)
//     // const comparedpassword =  await bcrypt.compare('Tammana123%',hashedpassword)
//     // console.log(comparedpassword)
// }

// myFunction()
