//const sendGridAPIKey = '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'
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeEmail = (name,email) =>
{
   sgMail.send({
       to:email,
       from:'tammanasharma108@gmail.com',
       subject:'Thanks for joining in',
       text:`Welcome to our app ${name}. Hope you will enjoy our services..`
   })
}

const sendCancellationEmail = (name,email) =>{
    sgMail.send({
        to:email,
        from:'tammanasharma108@gmail.com',
        subject:'Unsubscribing Mail',
        text:`${name},You are unsubscribing from our website.Suggest what can we do to improve our website..`
    })
}
module.exports={
    sendWelcomeEmail,
    sendCancellationEmail
}
// sgMail.send({
//     to:'tammanasharma108@gmail.com',
//     from:'tammanasharma108@gmail.com',
//     subject:'This is my first creation',
//     text:'I am very overwhelmed by sending this mail to you.'
// })