const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()

const Task = require('../models/task')
//Get /tasks?completed=true
//GET /tasks?limit=2&skip=2
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks',auth,async(req,res)=>
{
    const match={}
    const sort={}
    if(req.query.sortBy)
    {
        const part = req.query.sortBy.split(':')
        sort[part[0]]= sort[part[1]] === 'desc'? -1:1
    }
    if(req.query.completed){
        match.completed= req.query.completed==='true'
    }
    try{
   // const task = await Task.find({owner:req.user._id})
      await req.user.populate(
          {
          path:'tasks',
          match,
        options:{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }}).execPopulate()
    res.send(req.user.tasks)
    }
    catch(e){
       res.send(e)
    }
    // Task.find({}).then((tasks)=>
    // {
    //     res.send(tasks)
    // }).catch((e)=>
    // {
    //     res.send(e)
    // })
})

router.delete('/tasks/:id',auth,async(req,res)=>
{
    try{
     // const task = await Task.findByIdAndDelete(req.params.id)
     const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
     
      if(!task)
      {
          res.status(400).send()
      }
      task.remove()
      res.send(task)
    }
    catch(e){
       res.send(e)
    }
})

router.patch('/tasks/:id', auth,async(req,res)=>
{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update)
    )
    if(!isValidOperation)
    {
        res.status(400).send({error:'Invalid Updates!'})
    }
    try{
        //const task = await Task.findById(req.params.id)
       const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
         
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{ new :true, runValidators:true})
          if(!task)
          {
              res.status(404).send()
          }
          updates.forEach((update)=>{
            task[update]=req.body[update]
         })
         await task.save()
         res.send(task)
        }
    catch(e){
        res.send(e)
    }

})

router.get('/tasks/:id',auth,async(req,res)=>
{
   const _id= req.params.id
   try{
      const task = await Task.findOne({_id,owner:req.user._id})
      if(!task){
      return res.status(404).send()
      }
      res.send(task)
   }
   catch(e){
     res.send(e)
   }
//    Task.findById(_id).then((tasks)=>
//    {
//        if(!tasks)
//        {
//           return res.status(404).send()
//        }
//        res.send(tasks)
//    }).catch((e)=>
//    {
//         res.send(e)
//    })

})
router.post('/tasks',auth,async(req,res)=>
{
   // const task = new Task(req.body)
   const task=new Task({
       ...req.body,
       owner:req.user._id
   })

 try{
    await task.save()
    res.status(400).send(task)
 }
 catch(e){
     res.status(400).send()
 }
}
)

module.exports=router