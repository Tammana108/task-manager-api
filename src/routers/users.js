const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const sharp= require('sharp')
const {sendWelcomeEmail,sendCancellationEmail} = require('../emails/account')
//const {sendCancellationEmail} = require('../emails/account')

const multer= require('multer')

const User = require('../models/user')
router.get('/test',(req,res)=>
{
    res.send('from a new file')
})
router.get('/users/me',auth,async(req,res)=>
{
    res.send(req.user)
    // try{
    // const user = await User.find({})
    // res.send(user)
    // }
    // catch(e){
    //    res.send(e)
    // }
    // // Task.find({}).then((tasks)=>
    // // {
    // //     res.send(tasks)
    // // }).catch((e)=>
    // // {
    // //     res.send(e)
    // // })
})

router.delete('/users/me',auth,async(req,res)=>
{
    try{
        await req.user.remove()
      //  sendCancellationEmail(req.user.name,req.user.email)
        res.send(req.user)
    //   const user = await User.findByIdAndDelete(req.params.id)
    //   if(!user)
    //   {
    //       res.status(400).send()
    //   }
    //   res.send(user)

    }
    catch(e){
       res.status(500).send(e)
    }
})

router.patch('/users/me',auth, async(req,res)=>
{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','age','email','password']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update)
    )
    if(!isValidOperation)
    {
        res.status(400).send({error:'Invalid Updates!'})
    }
    try{
       // const user = await User.findById(req.params.id)
        updates.forEach((update)=>{
           req.user[update]=req.body[update]
        })
         await req.user.save()
        // const user = await Task.findByIdAndUpdate(req.params.id,req.body,{ new :true, runValidators:true})
        //   if(!user)
        //   {
        //       res.status(404).send()
        //   }
         res.send(req.user)
        }
    catch(e){
        res.send(e)
    }

})
router.post('/users/login',async(req,res)=>
{
    try{
      
        const user= await User.findByCredentials(req.body.email,req.body.password)
      const token = await user.generateAuthToken()
        res.send({user,token})
    }
    catch(e){
        res.status(404).send(e)
    }
})

router.post('/users/logout',auth,async(req,res)=>
{
    try{
      req.user.tokens=req.user.tokens.filter((token)=>
      {
          return token.token !== req.token
      })
      await req.user.save()
      res.send()
    }catch(e){
       res.status(401).send()
    }
})
router.post('/users/logoutAll',auth,async(req,res)=>
{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }
    catch(e)
    {
        res.send(e)
    }
})
// router.get('/users/:id',async(req,res)=>
// {
//    const _id= req.params.id
//    try{
//       const user = await User.findById({_id})
//       res.send(user)
//    }
//    catch(e){
//      res.send(e)
//    }
// //    Task.findById(_id).then((tasks)=>
// //    {
// //        if(!tasks)
// //        {
// //           return res.status(404).send()
// //        }
// //        res.send(tasks)
// //    }).catch((e)=>
// //    {
// //         res.send(e)
// //    })

// })
// router.post('/users',(req,res)=>
// {
//     const user = new User(req.body)

//     user.save().then(()=>
//     {
//       res.status(201).send(user)
//     }).catch(()=>{
//     res.status(400).send(e)
//     }
//     )
// }
// )
router.post('/users',async(req,res)=>
{
    const user = new User(req.body)
    
    try{
       
      await user.save()
      sendWelcomeEmail(user.name,user.email)
       const token = await user.generateAuthToken()
        res.send({user,token})

        
    }
    catch(e){
        res.status(404).send(e)
    }
})
const upload=multer({
   // dest:'avatar',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb)
    {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
           return cb(new Error("File must be an image"))
        }
        cb(undefined,true)
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>
{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>
{
    res.status(404).send({error:error.message})
}
)
router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send()
})
router.get('/users/:id/avatar',async(req,res)=>
{
    
    try{
        const user = await User.findById(req.params.id)
        if(!user||!user.avatar)
        {
     throw new Error()
        }
    res.set('Content-Type','image/jpg')
    res.send(user.avatar)
    }
    catch(e){
        res.status(404).send()
    }
})

module.exports=router