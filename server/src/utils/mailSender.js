import nodeMailer from 'nodemailer'

const sendMail = async ({ to, subject, html }) => {
    try {
        const transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        })

        const info = await transporter.sendMail({
            from: `SwiftBasket <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html
        })

        return true

    } catch (error) {
        console.log('Email sending error:', error)
        return false
    }
}

export default sendMail
