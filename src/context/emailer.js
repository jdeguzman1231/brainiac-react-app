import nodemailer from 'nodemailer'

export const cred = {
    SERVICE_ID: "service_6qst8nm",
    USER_ID: "user_VzwWDiJXKbfZn05d3Pg3x",
    ACCESS_TOKEN: "5fdb5f9eb594efe4cf19196ba02b5a92",
    TEMPLATE_ID: "template_txkx6tb"
}


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass:  process.env.PASSWORD
    }
})
export const requestEmail = (url, email) =>{
    let info = transporter.sendMail({
        to: email,
        subject: "Password reset",
        html: `Please click this link to reset your password: <a href = ${url}>${url}</a>`
    });
    console.log("Message sent: %s", info.messageId);


}