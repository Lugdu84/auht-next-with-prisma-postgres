import nodemailer from 'nodemailer'
import * as handlebars from 'handlebars'

const sendMail = async (
  to: string,
  name: string,
  image: string,
  url: string,
  subject: string,
  template: string
) => {
  const {
    MAILING_EMAIL,
    MAILING_PASSWORD,
    // SMTP_HOST,
    // SMTP_PORT,
    // SMTP_EMAIL,
    // SMTP_PASSWORD,
  } = process.env

  // --------create transporter----------------
  // const mailConfig = {
  //   host: SMTP_HOST,
  //   port: Number(SMTP_PORT),
  //   secure: false,
  //   auth: {
  //     user: SMTP_EMAIL,
  //     pass: SMTP_PASSWORD,
  //   },
  // }

  const gmailConfig = {
    service: 'gmail',
    auth: {
      user: MAILING_EMAIL,
      pass: MAILING_PASSWORD,
    },
  }

  const transporter = await nodemailer.createTransport(gmailConfig)

  const data = handlebars.compile(template)
  const replacements = {
    name,
    email_link: url,
    image,
  }
  const html = data(replacements)
  // --------verify connection configuration
  await new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.error(error)
        reject(error)
      } else {
        console.log('Server is ready to take our messages')
        resolve(success)
      }
    })
  })

  // --------send mail----------------
  const options = {
    from: MAILING_EMAIL,
    to,
    subject,
    html,
  }
  await new Promise((resolve, reject) => {
    transporter.sendMail(options, (error, info) => {
      if (error) {
        console.error(error)
        reject(error)
      } else {
        console.log(`Email sent: ${info.response}`)
        resolve(info)
      }
    })
  })
}

export default sendMail
