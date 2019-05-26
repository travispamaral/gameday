const axios = require('axios')
const { format } = require('date-fns')
const nodemailer = require('nodemailer')

exports.handler = async (event, context, callback) => {
  const { MAIL_PASSWORD, MAIL_USER } = process.env
  const url = 'http://gameday.netlify.com/games.json'
  const today = format(new Date(), 'M/DD/YYYY')

  const pass = { statusCode: 200, body: 'Email sent!' }
  const fail = { statusCode: 404, body: 'No game' }

  // Setup SMTP details
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { MAIL_USER, MAIL_PASSWORD }
  })

  return axios.get(url)
    .then(res => {
      const game = res.data[0][today] // Get today's game if exists

      if (!game) {
        console.log('no game')
        return callback(null, fail)
      } else {
        console.log('game')
        const mailOptions = {
          from: `"Travis Amaral" <travispamaral@gmail.com>`,
          to: 'travispamaral@gmail.com',
          subject: '⚾ Gameday automation - GAME TODAY! ⚾',
          html: `<h4>There is a game today!</h4>
          <p><strong>${game['SUBJECT']} | ${game['START TIME']}</strong></p>
          <p><a href="https://gameday.netlify.com">https://gameday.netlify.com</p>
          `
        }
        // Send the email
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return callback(null, {
              statusCode: 500,
              body: JSON.stringify({
                error: error.message
              })
            })
          }

          return callback(null, pass)
        })
      }
    })
    .catch(error => callback(null, { statusCode: 400, body: JSON.stringify({ error: error.message }) }))
}
