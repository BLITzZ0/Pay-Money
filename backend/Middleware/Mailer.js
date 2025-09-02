let nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:'blitzz463@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
    }
});


function sendEmail(to, subject,text){
    let mailOption = {
        from: 'blitzz463@gmail.com',
        to,
        subject,
        text,
    };
    
    transporter.sendMail(mailOption,function(error,info){
        if(error){
            console.log(error)
        }else{
            console.log("Email Sent" + info.response)
        }
    })
}

module.exports = sendEmail;