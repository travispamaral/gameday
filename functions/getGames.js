const axios = require('axios')
const { format } = require('date-fns')
const nodemailer = require('nodemailer')

exports.handler = (event, context) => {
  const { MAIL_PASSWORD, MAIL_USER } = process.env
  console.log(MAIL_USER, MAIL_PASSWORD)
  const url = 'http://gameday.netlify.com/games.json'
  const today = format(new Date(), 'M/DD/YYYY')

  // Setup SMTP details
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { MAIL_USER, MAIL_PASSWORD }
  })

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(res => {
        const game = res.data[0]['4/28/2019'] // Get today's game if exists
        const mailOptions = {
          from: `"Travis Amaral" <travispamaral@gmail.com>`,
          to: 'travispamaral@gmail.com',
          subject: '⚾ Gameday automation - GAME TODAY! ⚾',
          html: `<h4>There is a game today!</h4>
          <p><strong>${game['SUBJECT']} | ${game['START TIME']}</strong></p>
          <p><a href="https://gameday.netlify.com">https://gameday.netlify.com</p>
          `
        }

        console.log(game)

        if (!game) {
          console.log('no game')
          resolve({
            statusCode: 200,
            body: 'No Game Today'
          })
        }

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log('Error sending email')
            resolve({
              statusCode: 500,
              body: JSON.stringify(error)
            })
          }

          resolve({
            statusCode: 200,
            body: 'Email sent!'
          })
        })
      })
      .catch(error => {
        console.log(error)
        resolve({
          statusCode: 400,
          body: JSON.stringify({ error: error.message })
        })
      })
  })
}
