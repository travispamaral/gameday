const axios = require('axios')
const { format } = require('date-fns')
const nodemailer = require('nodemailer')

const url = 'http://gameday.netlify.com/games.json'
const today = format(new Date(), 'M/DD/YYYY')
const user = process.env.MAIL_USER
const pass = process.env.MAIL_PASSWORD

// Setup SMTP details
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user, pass }
})

// Check if game today and return game {}
const isGameToday = (games) => {
  const game = games[0][today]
  if (game) {
    return game
  } else {
    return null
  }
}

exports.handler = (event, context, callback) => {
  return axios.get(url)
    .then(res => isGameToday(res.data))
    .then(game => {
      if (!game) {
        callback(null, {
          statusCode: 500,
          body: JSON.stringify({
            error: 'No Game Today'
          })
        })
      }
      // Setup email
      const mailOptions = {
        from: `"Travis Amaral" <travispamaral@gmail.com>`,
        to: 'travispamaral@gmail.com',
        subject: '⚾ Gameday automation - GAME TODAY! ⚾',
        html: `<h4>There is a game today!</h4>
        <p><strong>${game['SUBJECT']} | ${game['START TIME']}</strong></p>
        <p><a href="https://gameday.netlify.com">https://gameday.netlify.com</p>
        `
      }

      // Send the email... or don't :)
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          callback(null, {
            statusCode: 500,
            body: JSON.stringify({
              error: error.message
            })
          })
        }
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: `Email sent!`
          })
        })
      })
    })
    .catch(error => ({ statusCode: 422, body: String(error) }))
}
