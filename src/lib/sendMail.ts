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
    MAILING_PASSWORD_TEST,
    MAILING_EMAIL_TEST,
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

  let mailConfig

  if (process.env.NODE_ENV === 'production') {
    mailConfig = {
      service: 'gmail',
      auth: {
        user: MAILING_EMAIL,
        pass: MAILING_PASSWORD,
      },
    }
  } else {
    mailConfig = {
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: MAILING_EMAIL_TEST,
        pass: MAILING_PASSWORD_TEST,
      },
    }
  }

  const transporter = await nodemailer.createTransport(mailConfig)

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
        reject(error)
      } else {
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
        reject(error)
      } else {
        resolve(info)
        console.log('Preview URL : ', nodemailer.getTestMessageUrl(info))
      }
    })
  })
}

export default sendMail
